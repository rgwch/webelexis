/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'bus', 'app/config', 'text!tmpl/ch-webelexis-addpatient.html', 'app/datetools', 'i18n', 'jquery', 'validate'], function (ko, bus, cfg, html, dt, R, $) {


  function AddPatientModel() {
    var self = this
    self.title = "Daten erfassen"
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
      return R[name]
    }

    self.send = function () {
      // send request only if validate is okay. Convert birthdate to Elexis format.
      if (self.vtor.numberOfInvalids() === 0) {
        console.log(JSON.stringify(self.data()))
        var payload = self.data()
        var date = dt.makeDateFromLocal(payload.geburtsdatum)
        payload.geburtsdatum = dt.makeCompactString(date)
        payload.sessionID = cfg.sessionID
        payload.username = payload.email.toLowerCase()
        payload.origin = window.location.origin
        bus.send("ch.webelexis.patient.add", payload, function (result) {
          if (result === undefined) {
            window.alert("Verbindungsfehler")
          } else if (result.status === "ok") {
            window.location.hash = "#alert/newpathead/newpatbody"
          } else {
            console.log(result.status + " " + result.message)
            window.alert(result.status)
          }
        })
      } else {
        self.vtor.showErrors()
        console.log("not sending: invalid fields: " + self.vtor.numberOfInvalids())
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
        vorname: R.warn_firstname,
        name: R.warn_lastname,
        geburtsdatum: R.warn_dob,
        email: R.warn_mail,
        pass: R.warn_pwd,
        pwdrep: {
          required: R.warn_pwd_rep,
          equals: R.warn_pwd_match
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

  return {
    viewModel: AddPatientModel,
    template: html
  }
});
