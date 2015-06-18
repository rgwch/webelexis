/**
 **  This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/

define(['knockout', 'datetools', 'i18n', 'plugins/router'], function (ko, dt, R, router) {

    var addIf = function (pref, check) {
      if (check !== undefined && check !== null && check.length > 3) {
        return pref + check
      } else {
        return ""
      }
    };
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

      self.address = ko.computed(function () {
        var p = self.patient();
        if (p) {
          var ret = addIf("", p.Strasse) + addIf(", ", p.plz) + addIf(" ", p.Ort);
          return ret;

        }
        return ""
      });

      self.doShow = function (value) {
        if (value === undefined) {
          return false
        } else if (value === null) {
          return false

        } else if (value.length < 3) {
          return false

        } else {
          return true
        }
      }


      self.remark = ko.computed(function () {
        var p = self.patient();
        if (p) {
          if (p.bemerkung && p.bemerkung.length > 1) {
            return p.bemerkung
          }
        }
        return ""
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
        var $links = $parent.find("#phonelinks a")
        var max = 0
        $links.each(function () {
          if ($(this).width() > max) {
            max = $(this).width()
          }
        })
        $links.each(function(){
          $(this).width(max)
        })
      }
    };
    return PatientSummary
  }
)
;