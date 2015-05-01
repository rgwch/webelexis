/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'R', 'text!tmpl/ch-webelexis-verify.html'], function(ko, bus, i18n, html) {


  function VerifyModel(p) {
    var self = this
    self.R = i18n.R
    self.R.registerLocale("de", {
      verify_heading: "Konto Freischaltung",
      verify_start: "Ihr Freischaltcode wird geprüft",
      verify_ok: "Code wird zum Server geschickt.",
      badparams: "Fehler! Die Seite wurde mit ungültigen Parametern aufgerufen.",
      failure: "Vorgang konnte nicht erfolgreich abgeschlossen werden."
    })
    self.proc = ko.observable(self.R('verify_ok'))
    self.result = ko.observable("...")
    self.uid = ko.observable()
    self.vcode = ko.observable()
    self.busListener = function(ac) {
      if (ac === "open") {
        console.log("BusListener active")
        bus.send("ch.webelexis.patient.verify", {
          username: p.params[0],
          verify: p.params[1]
        }, function(result) {
          if (result.status === "ok") {
            self.result("Konto ist aktiviert.")
          } else {
            self.result("Fehler " + result.message)
          }
          bus.removeListener(self.busListener)
        })
      }
    }
    if (p.params === undefined || p.params.length < 2) {
      self.proc(self.R('badparams'))
      self.result(self.R('failure'))
    } else {
      self.uid(p.params[0])
      self.vcode(p.params[1])

      bus.addListener(function() {

      })
    }
    if (bus.connected()) {
      console.log("bus is connected")
      self.busListener("open")
    } else {
      console.log("bis is disconnected")
      bus.addListener(self.busListener)
    }
  }
  return {
    viewModel: VerifyModel,
    template: html
  }
})
