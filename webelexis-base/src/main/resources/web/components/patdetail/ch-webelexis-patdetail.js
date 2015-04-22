/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */

define(['knockout', 'app/eb', 'app/config', 'app/datetools', 'text!tmpl/ch-webelexis-patdetail.html'], function(ko, bus, cfg, dt, html) {
  //var dummy = '7ba4632caba62c5b3a366'


  function PatDetailModel(params) {
    var self = this
    var patid = params.params[0]
    self.title = "Patient Detail"
    self.data = ko.observable({
      "bezeichnung1": "",
      "bezeichnung2": ""
    })

    // this panel is displayed in the center
    self.activeCenterPanel = ko.observable("summaryView")

    // set center panel
    self.setPanel = function(item) {
      self.activeCenterPanel(item.detail)
    }

    // panels to display as buttons on the left/top
    self.leftpanel = [{
      title: "Personalien",
      detail: "summaryView",
      handler: "summaryViewHandler"
    }, {
      title: "Labor",
      detail: "labView",
      handler: "labViewHandler"
    }, {
      title: "Konsultation",
      detail: "consView",
      handler: "consViewHandler"
    }, {
      title: "Probleme",
      detail: "problemView",
      handler: "problemViewHandler"
    }, {
      title: "Dokumente",
      detail: "documentsView",
      handler: "documentsViewHandler"
    }]


    // construct a string for the patient display (name, firstname, gender, dob, age, patient ID)
    self.displayName = ko.computed(function() {
      var p = self.data()
      var now = new Date()
      var bdate = new Date()
      var age = 0
      if (p.geburtsdatum !== undefined) {
        bdate = dt.makeDateFromLocal(p.geburtsdatum)
        var diff = now.getTime() - bdate.getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      }
      return p.bezeichnung1 + " " + p.bezeichnung2 + " (" + p.geschlecht + "), " + p.geburtsdatum + " (" + age + ") [" + p.patientnr + "]"
    })
    self.address = ko.pureComputed(function() {
      var p = self.data()
      return p.strasse + ", " + p.plz + " " + p.ort + "; " + p.telefon1 + ", " + p.telefon2 + ", " + p.natelnr
    })

    // fetch patient summary
    self.loadSummary = function() {
      bus.send('ch.webelexis.patient.detail', {
        "request": "summary",
        "patid": patid,
        "sessionID": cfg.sessionID
      }, function(result) {
        if ((result === undefined) || (result.status !== "ok")) {
          window.alert("fehler bei der abfrage " + result.status + result.message);
        } else {
          result.patient.geburtsdatum = dt.makeDateFromElexisDate(result.patient.geburtsdatum)
          self.data(result.patient)
        }
      });

    }

    self.loadSummary()
  }

  return {
    viewModel: PatDetailModel,
    template: html
  }
});
