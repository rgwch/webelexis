define(['knockout', 'text!tmpl/ch-webelexis-wait.html', 'R', 'app/config'], function(ko, html, i18, cfg) {
  var R = i18.R

  R.registerLocale("de", {
    patience: "...lade Daten... Bitte einen Moment Geduld..."
  })

  R.setLocale(cfg.locale())

  function WaitViewModel() {
    var self = this

    self.locale = function(name, elem) {
      return R(name, elem)
    }
  }
  return {
    viewModel: WaitViewModel,
    template: html
  }

})
