/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'text!tmpl/ch-webelexis-addpatient.html', 'app/datetools', 'app/i18n!nls/ui.js', 'jquery', 'validate', 'domReady!'], function(ko, bus, cfg, html, dt, T, $) {
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
      pass: "",
    })

    self.labels = [T.firstname, T.name, T.dob, T.mail]

    self.send = function() {
      // send request only if validate is okay. Convert birthdate to Elexis format.
      if (self.vtor.numberOfInvalids() === 0) {
        console.log(JSON.stringify(self.data()))
        var payload = self.data()
        var date = dt.makeDateFromLocal(payload.geburtsdatum)
        payload.geburtsdatum = dt.makeCompactString(date)
        payload.sessionID = cfg.sessionID
        payload.username = payload.email
        bus.send("ch.webelexis.patient.add", payload, function(result) {
          if (result === undefined) {
            window.alert("Verbindungsfehler")
          } else if (result.status === "ok") {
            console.log("ok")
            bus.send('ch.webelexis.session.login', {
              sessionID: cfg.sessionID,
              mode: "local",
              username: payload.email.toLowerCase(),
              password: payload.pass
            }, function(result) {
              if (result.status === "ok") {
                console.log("logged in")
                result.user.loggedIn = true
                cfg.user(result.user)
                location.hash = "#"
              } else {
                console.log(result.status)
                console.log(result.message)
                window.alert(result.status)
              }
            })
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
        vorname: "Bitte geben Sie Ihren Vornamen an",
        name: "Bitte geben Sie Ihren Namen an",
        geburtsdatum: "Die Angabe des Geburtsdatums ist erforderlich (t.m.j)",
        email: "Die korrekte Mail-Adresse wird als Login-Name benötigt.",
        pass: "Ein mindestens 5 Zeichen langes Passwort muss eingetragen werden",
        pwdrep: {
          required: "Bitte bestätigen Sie Ihr Passwort hier.",
          equals: "Die Passwörter sind nicht identisch."
        }
      }
    })


    $.validator.addMethod("datum", function(act) {
      var pattern = /^\d{1,2}\.\d{1,2}\.(?:\d{4}|\d{2})$/
      return (pattern.exec(act) !== null)
    })

    $.validator.addMethod("mailaddr", function(act) {
        var pattern = /.+@[a-zA-Z_0-9\.]*[a-zA-Z_0-9]{2,}\.[a-zA-Z]{2,3}/
        return (pattern.exec(act) !== null)
      })
      // equalTo ddidn't work ?!??
    $.validator.addMethod("equals", function(act) {
      var other = self.data().pass
      return act === other
    })

  }
  return {
    viewModel: AddPatientModel,
    template: html
  }
});
