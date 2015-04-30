/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'text!tmpl/ch-webelexis-addpatient.html', 'app/datetools', 'R', 'jquery', 'validate'], function(ko, bus, cfg, html, dt, i18, $) {
  var R = i18.R

  R.registerLocale("de", {
    heading:"Personalien eintragen",
    firstname: "Vorname",
    lastname: "Name",
    dob: "Geburtsdatum",
    mail: "E-Mail",
    street: "Strasse",
    zip: "Plz",
    place: "Ort",
    phone: "Telefon",
    mobile: "Mobil",
    insurance: "Krankenkasse",
    insurance_no: "Versichertennummer",
    password: "Passwort",
    password_rep: "Passwort wiederholen",
    existing_pat: " Wenn Sie schon Patient/in bei uns sind, und jetzt nur ein Konto für die Online-Terminvergabe erstellen möchten, wählen Sie bitte diese Option. Achten Sie bitte darauf, Namen und Geburtsdatum korrekt einzugeben, damit die Termine richtig zugeordnet werden können.",
    new_pat: " Wenn Sie noch nie bei uns waren, wählen Sie bitte diese Option und füllen Sie möglichst alle Felder aus. Fehlende Angaben können Sie selbstverständlich auch noch auf dem gewohnten Papier-Formular ergänzen, wenn Sie bei uns eintreffen.",
    send_form: "Formular absenden",
    privacy_header: "Datenschutzerklärung",
    privacy_body: "Ihre Angaben werden nur zum Erstellen des Benutzerkontos und - falls noch nicht vorhanden - der Patientenakte verwendet, und um Sie nötigenfalls zu kontaktieren, falls wir einen Termin verschieben müssen. Unter keinen Umständen geben wir Daten an Dritte weiter. Wir werden Ihre Angaben auch nicht für Marketingzwecke missbrauchen. Sie können Jederzeit die Löschung Ihres Kontos und der hier eingetragenen Daten verlangen.",
    warn_firstname: "Bitte geben Sie Ihren Vornamen ein.",
    warn_lastname: "Bitte geben Sie Ihren Namen ein.",
    warn_dob: "Bitte geben Sie Ihr Geburtsdatum ein (Format: t.m.y).",
    warn_mail: "Die Mailadresse ist erforderlich (sie ist Ihr Login-Name).",
    warn_pwd: "Das Passwort ist erforderlich (mindestens 5 Zeichen).",
    warn_pwd_rep: "Bitte wiederholen Sie Ihr Passwort hier.",
    warn_pwd_match: "Die beiden Passwörter stimmen nicht überein."

  })

  R.registerLocale("en", {
    heading:"Enter personal informations",
    firstname: "first name",
    lastname: "last name",
    dob: "birthdate",
    mail: "mail",
    street: "street",
    zip: "zip",
    place: "place",
    phone: "phone #",
    mobile: "mobile phone",
    insurance: "insurance",
    insurance_no: "insurance number",
    password: "password",
    password_rep: "password (repeat)",
    existing_pat: " If you are already a patient in our practice bot don't have an account, check here.",
    new_pat: " If you are new to our practice, please check here and fill out all required fields",
    send_form: "transmit form",
    privacy_header: "Declaration of privacy",
    privacy_body: "We will use your details exclusively to create your account, and to contact you in case we need to change an appointment. We shall never disclose any of your details to third parties, unless required to do so by legal enforcement authorities.",
    warn_firstname: "Please enter your first name.",
    warn_lastname: "Please enter your last name.",
    warn_dob: "Please enter your birthdate (european form: d.m.y).",
    warn_mail: "The mail address is required (it will be your login name).",
    warn_pwd: "A password of at least 5 characters is required.",
    warn_pwd_rep: "Please enter your password here again.",
    warn_pwd_match: "The passwords do not match."
  })

  R.setLocale(cfg.locale())

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

    self.labels = [R('firstname'), R('lastname'), R('dob'), R('mail'), R('street'), R('zip'),
      R('place'), R('phone'), R('mobile'), R('insurance'), R('insurance_no')
    ]
    self.locale = function(name, elem) {
      return R(name, elem)
    }

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
                window.location.hash = "#"
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
        vorname: R('warn_firstname'),
        name: R('warn_lastname'),
        geburtsdatum: R('warn_dob'),
        email: R('warn_mail'),
        pass: R('warn_pwd'),
        pwdrep: {
          required: R('warn_pwd_rep'),
          equals: R('warn_pwd_match')
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
