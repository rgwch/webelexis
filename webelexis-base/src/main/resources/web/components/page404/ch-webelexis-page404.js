/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-page404.html', 'app/config'], function(ko, html, cfg) {

  var Locale = {
    de: {
      title: "Seite nicht gefunden",
      body: "Die Seite, die Sie aufgerufen haben, existiert in diesem System nicht."
    }
  }

  var R = Locale[cfg.locale()]

  function NotFoundViewModel() {
    this.msg = function(id) {
      return R[id]
    }
    var title = "404"

  }
  return {
    viewModel: NotFoundViewModel,
    template: html
  }
});
