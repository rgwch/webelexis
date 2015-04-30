/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-alert.html', 'R', 'app/config'], function(ko, html, i18, cfg) {
  var R = i18.R

  R.registerLocale("de", {
    sysmsg: "Systemmitteilung",
    timeout: "Sie wurden wegen zu langer Inaktivität automatisch ausgeloggt. Bitte melden Sie sich ggf. erneut an."
  })

  R.setLocale(cfg.locale())

  function AlertModel(p) {
    var self = this;
    self.heading = ko.observable(R(p.params[0]))
    self.body = ko.observable(R(p.params[1]))
  }
  return {
    viewModel: AlertModel,
    template: html
  }
})
