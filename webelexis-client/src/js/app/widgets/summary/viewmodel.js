/**
 **  This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/

define(['knockout', 'datetools', 'i18n', 'plugins/router'], function (ko, dt, R, router) {

    var PatientSummary = function () {
      var self = this;
      self.patient = ko.observable();

      self.nav = function (loc) {
        if (self.patient()) {
          router.navigate("#" + loc + "/" + self.patient().id)
        }
      };
      // construct a string for the patient display (name, firstname, gender, dob, age, patient ID)
      self.displayName = ko.computed(function () {
        var p = self.patient();
        if (p) {

          var now = new Date();
          var bdate = new Date();
          var age = 0;
          if (p.Geburtsdatum !== undefined && p.Geburtsdatum !== null) {
            bdate = dt.makeDateObjectFromCompact(p.Geburtsdatum);
            if (bdate.getTime) {
              var diff = now.getTime() - bdate.getTime();
              age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            }
          } else {
            p.Geburtsdatum = ""
          }
          if (p.geschlecht === undefined || p.geschlecht === null) {
            p.geschlecht = "?"
          }
          var ret = p.Bezeichnung1 + " " + p.Bezeichnung2 + " (" + p.geschlecht + "), " + dt.makeLocalFromCompact(p.Geburtsdatum) + " (" + age + ") [" + p.patientnr + "]";
          return ret
        }
        else {
          return "?"
        }
      });

      self.activate = function (settings) {
        self.patient(settings.patient)
      };
      self.compositionComplete = function (parent, context) {
        var $parent = $(parent);
        var $buttons = $parent.find("button");
        var max = 0;
        $buttons.each(function (b) {
          if ($(this).width() > max) {
            max = $(this).width()
          }
        });
        $buttons.each(function () {
          $(this).width(max)
        })
      }
    };
    return PatientSummary
  }
)
;