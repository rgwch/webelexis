/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'bus', 'config', 'datetools', 'i18n', 'durandal/app', 'jquery', 'validate'], function (ko, bus, cfg, dt, R, appl, $) {


  function AddPatientModel() {
    var self = this
    self.data = ko.observable({
      vorname: "",
      name: "",
      geburtsdatum: "",
      strasse: "",
      plz: "",
      ort: "",
      email: "",
      telefon: "",
      mobil: "",
      krankenkasse: "",
      versicherungsnummer: "",
      pass: ""
    })

    self.labels = [R.t('m.add.firstname'), R.t('m.add.lastname'), R.t('m.add.dob'), R.t('m.add.mail'), R.t('m.add.street'), R.t('m.add.zip'),
      R.t('m.add.place'), R.t('m.add.phone'), R.t('m.add.mobile'), R.t('m.add.insurance'), R.t('m.add.insurance_no')
    ]
    self.locale = function (name) {
      return R.t('m.add.' + name)
    }

    self.send = function () {
      // send request only if validate is okay. Convert birthdate to Elexis format.
      if (self.vtor.numberOfInvalids() === 0) {
        system.log(JSON.stringify(self.data()))
        var payload = self.data()
        var date = dt.makeDateObjectFromLocal(payload.geburtsdatum)
        payload.geburtsdatum = dt.makeCompactFromDateObject(date)
        payload.sessionID = cfg.sessionID
        payload.username = payload.email.toLowerCase()
        payload.origin = window.location.origin
        bus.send("ch.webelexis.patient.add", payload, function (result) {
          if (result === undefined) {
            appl.showMessage(R.t('global.notConnectedBody'), R.t('global.notConnectedHead'))
          } else if (result.status === "ok") {
            window.location.hash = "#alert/newpathead/newpatbody"
          } else {
            system.log(result.status + " " + result.message)
            appl.showMessage(result.status, R.t('global.error'))
          }
        })
      } else {
        self.vtor.showErrors()
        system.log("not sending: invalid fields: " + self.vtor.numberOfInvalids())
      }
    }

    self.accountDisplay = ko.observable("palt")

    self.vtor = $("#eingabe").validate({
      debug: true,
      rules: {
        vorname: "required",
        name: "required",
        geburtsdatum: {
          required: true,
          ///datum: "true"

        },
        email: {
          required: true,
          mailaddr: true
        },
        pass: {
          required: true,
          minlength: 5
        },
        pwdrep: {
          required: true,
          equals: "#pass"
        }

      },
      messages: {
        vorname: R.t('m.add.warn_firstname'),
        name: R.t('m.add.warn_lastname'),
        geburtsdatum: R.t('m.add.warn_dob'),
        email: R.t('m.add.warn_mail'),
        pass: R.t('m.add.warn_pwd'),
        pwdrep: {
          required: R.t('m.add.warn_pwd_rep'),
          equals: R.t('m.add.warn_pwd_match')
        }
      }
    })


    $.validator.addMethod("datum", function (act) {
      var pattern = /^\d{1,2}\.\d{1,2}\.(?:\d{4}|\d{2})$/
      return (pattern.exec(act) !== null)
    })

    $.validator.addMethod("mailaddr", function (act) {
      var pattern = /.+@[a-zA-Z_0-9\.]*[a-zA-Z_0-9]{2,}\.[a-zA-Z]{2,3}/
      return (pattern.exec(act) !== null)
    })
    // equalTo ddidn't work ?!??
    $.validator.addMethod("equals", function (act) {
      var other = self.data().pass
      return act === other
    })

  }

  return AddPatientModel

});
