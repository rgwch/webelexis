/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'app/datetools', 'bus', 'app/config', 'components/labview/lab_handler', 'text!tmpl/ch-webelexis-labview.html', 'components/labview/charttool', 'underscore', 'spark'], function(ko, dt, bus, cfg, lh, html, chart, _) {
  var dummy = '7ba4632caba62c5b3a366'

  var Locale = {
    de: {
      loading: "Lade Daten...",
      parameter: "Parameter",
      twelvemonths: "12 Monate",
      older: "Älter",
      actual: "Aktuell",
      details: "Details",
      verlauf: "Verlauf",
      sparkline: "Verlauf",
      noanswer: "Keine Antwort vom Server"
    }
  }

  function LabViewModel(prm) {
    var self = this
    self.R = Locale[cfg.locale()]
    self.crunched = {}
    self.loaded = ko.observable(false)
    self.display = ko.observable("table")
    self.groups = ko.observableArray()
    self.activeGroup = ko.observable(0)
    self.patid = prm.params[0]
    self.checkedItems = ko.observable({})
    self.context2d = {}
    self.lineChart = {}

    self.openGroup = function(index) {
      self.activeGroup(index())

      $(".sparkline").sparkline("html", {
        tooltipOffsetY: 0
      })
    }

    /* is a labItem checked? */
    self.isChecked = function(item) {
      return self.checkedItems().hasOwnProperty(item.key)
    }

    /* create the sparks for sparkline */
    self.createSparks = function(item) {
      var ret = ""
      for (var i = 0; i < item.samples.length; i++) {
        ret += parseFloat(item.samples[i].result) + ","
      }
      return ret.substring(0, ret.length - 1)
    }

    /* toggle checked/unchecked state of labItem */
    self.toggleItem = function(item) {
      var o = self.checkedItems()
      var key = item.key
      if (o.hasOwnProperty(key)) {
        delete o[key]
      } else {
        o[key] = item
      }
      self.checkedItems(o)
    }

    /* create a chart of checked labItem(s) */
    self.createChart = function() {
      self.display('chart')
      self.context2d = $("#chartCanvas").get(0).getContext("2d")
      self.lineChart = chart.create(self.checkedItems(), self.context2d)
    }
    self.closeChart = function() {
        if (self.linechart !== undefined) {
          self.lineChart.destroy()
        }
        self.display('table')
      }
      /* push all items of a group into an array */
    self.itemsInGroup = function(group) {
      var ret = []
      for (var key in group.items) {
        ret.push(group.items[key])
      }
      return ret
    }
    self.groupname = function(group) {
      return group.name.slice(group.name.indexOf(" "));
    }
    self.noteworthy = function(group) {

    }

    self.outOfRange = function(refvalue, value) {
      var minmax = lh.getRange(refvalue)
      return lh.isOutOfRange(value, minmax)
    }

    self.displayText = function(value) {
      if (isNaN(value)) {
        return ""
      } else if (parseFloat(value) === 0) {
        return ""
      } else {
        return value.toFixed(2)
      }
    }

    // fetch lab summary
    self.loadLabSummary = function() {
      bus.send("ch.webelexis.patient.labresult", {
        "mode": "latest",
        "patid": self.patid,
        "sessionID": cfg.sessionID
      }, function(result) {
        if (result === undefined) {
          window.alert(self.R.noanswer)

        } else if (result.status !== "ok") {
          window.alert("Fehler bei der Abfrage: " + result.status + " " + result.message)
        } else {
          self.crunched = lh.crunch(result)
            //console.log(JSON.stringify(self.crunched))

          for (var key in self.crunched.groups) {
            self.groups.push(self.crunched.groups[key])
          }
          self.loaded(true)

        }
      })
    }
    self.busListener = function(msg) {
      if (msg === "open") {
        self.loadLabSummary()
      }
    }
    bus.addListener(self.busListener, true)
  }
  LabViewModel.prototype.dispose = function() {
    bus.removeListener(LabViewModel.busListener)
  }
  return {
    viewModel: LabViewModel,
    template: html
  };

});
