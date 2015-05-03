/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'app/datetools', 'app/eb', 'app/config', 'components/labview/lab_handler', 'text!tmpl/ch-webelexis-labview.html'], function(ko, dt, bus, cfg, lh, html) {
  var dummy = '7ba4632caba62c5b3a366'

  var Locale = {
    de: {
      loading: "Lade Daten..."
    }
  }

  function LabViewModel(prm) {
    var self = this
    self.R = Locale[cfg.locale()]
    self.crunched = {}
    self.loaded = ko.observable(false)
    self.items = ko.observableArray()

    self.outOfRange = function(refvalue, value) {
        var range = refvalue.split("-")
        if (range.length === 2) {
          if (isNaN(range[0]) || isNaN(range[1]) || isNaN(value)) {
            return false
          }
          var min = parseFloat(range[0])
          var max = parseFloat(range[1])
          var val = parseFloat(value)
          if (val < min || val > max) {
            return true
          }
        }
        return false;
      }
      //
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
        "patid": dummy,
        "sessionID": cfg.sessionID
      }, function(result) {
        if (result === undefined) {
          window.alert("Keine Antwort vom Server")

        } else if (result.status !== "ok") {
          window.alert("Fehler bei der Abfrage: " + result.status + " " + result.message)
        } else {
          self.crunched = lh.crunch(result)
            //console.log(JSON.stringify(self.crunched))

          for (var item in self.crunched.items) {
            self.items.push(self.crunched.items[item])
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
