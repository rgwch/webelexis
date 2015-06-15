/**
 * Created by gerry on 15.06.15.
 */

define(['bus', 'config', 'knockout', 'durandal/app', 'i18n', 'datetools'], function (bus, cfg, ko, appl, R, dt) {

  function PatientDetail() {
    var self = this

    self.data = ko.observable()
    self.displayName = ko.observable()
    self.update = function () {
      system.log("update")
    }

    self.activate = function (id) {
      bus.send("ch.webelexis.patient.detail", {
        request: "summary",
        patid: id,
        sessionID: cfg.sessionID
      }, function (result) {
        if (result === undefined) {
          appl.showMessage(R.t('global.timeout'), R.t('global.connection_error'))
        } else {
          if (result.status === "ok") {
            result.patient.geburtsdatum = dt.makeDateFromElexisDate(result.patient.geburtsdatum)
            self.data(result.patient)
            self.displayName(result.patient.bezeichnung1 + " " + result.patient.bezeichnung2 + ", " + result.patient.geburtsdatum)
          } else {
            appl.showMessage(result.status + ": " + result.message, R.t('globel.error'))
          }
        }

      })
    }

  }

  return PatientDetail
})