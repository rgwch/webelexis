/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'app/datetools', 'bus', 'app/config', 'components/labview/lab_handler', 'text!tmpl/ch-webelexis-labview.html', 'components/labview/charttool'], function(ko, dt, bus, cfg, lh, html, chart) {
  var dummy = '7ba4632caba62c5b3a366'

  var Locale = {
    de: {
      loading: "Lade Daten...",
      parameter: "Parameter",
      twelvemonths: "12 Monate",
      older: "Älter",
      actual: "Aktuell",
      details: "Details",
      verlauf: "Verlauf"
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
    }

    /* is a labItem checked? */
    self.isChecked = function(item) {
      return self.checkedItems().hasOwnProperty(item.key)
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
        self.lineChart.destroy()
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
    self.outOfRange = function(refvalue, value) {
      if ((refvalue !== undefined) && (refvalue !== null) && (typeof refvalue == 'string')) {
        var val = parseFloat(value)
        var range = refvalue.split("-")
        if (range.length === 2) {
          if (isNaN(range[0]) || isNaN(range[1]) || isNaN(value)) {
            return false
          }
          var min = parseFloat(range[0])
          var max = parseFloat(range[1])
          if (val < min || val > max) {
            return true
          }
        } else {
          var margin = refvalue.trim()
          if (margin.charAt(0) == '<') {
            if (val > parseFloat(margin.substring(1))) {
              return true
            }
          } else if (margin.charAt(0) == '>') {
            if (val < parseFloat(margin.substring(1))) {
              return true
            }
          }
        }
      }
      return false;
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
          window.alert("Keine Antwort vom Server")

        } else if (result.status !== "ok") {
          window.alert("Fehler bei der Abfrage: " + result.status + " " + result.message)
        } else {
          self.crunched = lh.crunch(result)
            //console.log(JSON.stringify(self.crunched))

          for (var key in self.crunched.groups) {
            self.groups.push(self.crunched.groups[key])
          }
          self.loaded(true)
            //var crunched = lh.crunch(result)
            //var table=lh.makeTable(crunched)
            //self.labItems.removeAll();
            //for(var i=0;i<table.length;i++){
            //  self.labItems.push(table[i])
            //}
            //self.labItems.push([['a','1'],['b',"2"],['c',"3"]])
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
