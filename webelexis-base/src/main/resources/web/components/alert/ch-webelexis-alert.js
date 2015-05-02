/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-alert.html', 'app/config'], function(ko, html, cfg) {
  var Locale = {

    de: {
      sysmsg: "Systemmitteilung",
      timeout: "Sie wurden wegen zu langer Inaktivität automatisch ausgeloggt. Bitte melden Sie sich ggf. erneut an.",
      pwdheading: "Passwortänderung",
      pwdbody: "Ihr Passwort wurde geändert. Das neue Passwort ist ab sofort gültig.",
      newpathead: "Ihr Konto wurde erstellt.",
      newpatbody: "Bevor Sie sich einloggen können, müssen Sie zunächst bestätigen, dass Sie wirklich die angegebene Mail-Adresse besitzen. Wir haben Ihnen an diese Adresse eine Mail gesandt, die einen Bestätigungscode enthält. Mit diesem Code können Sie Ihr Konto freischalten.",
      ghead: "Google user nicht bekannt",
      gbody: "Ihr Browser hat versucht, Sie mit Ihrem Google-Konto automatisch anzumelden. Es ist aber noch kein Konto mit diesem Namen (=Mailadresse des Google-Kontos) vorhanden. Bitte erstellen Sie zunächst ein Konto, wenn Sie sich mit Ihrem Google-Konto anmelden möchten."

    },
    en: {
      sysmsg: "System message",
      timeout: "You have been logged out due to inactivity",
      pwdheading: "Password change",
      pwdbody: "Your password has been changed. It is valid by now.",
      newpathead: "Your account is created",
      newpatbody: "We sent you an e-mail with a verification code. After entering that verification code, your account will be ready."
    }
  }

  var R = Locale[cfg.locale()]

  function AlertModel(p) {
    var self = this;
    self.heading = ko.observable(R[p.params[0]])
    self.body = ko.observable(R[p.params[1]])
  }
  return {
    viewModel: AlertModel,
    template: html
  }
})
