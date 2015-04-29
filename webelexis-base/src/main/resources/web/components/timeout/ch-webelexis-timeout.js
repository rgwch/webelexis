/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout','text!tmpl/ch-webelexis-timeout.html', 'R'],function(ko,html,i18){
  var R=i18.R

  R.registerLocale("de",{
    sysmsg:"Systemmitteilung",
    timeout:"Sie wurden wegen zu langer Inaktivität automatisch ausgeloggt. Bitte melden Sie sich ggf. erneut an."
  })
  function TimeoutModel(){
    var self=this;
    self.message=function(varb){
      return R(varb)
    }
  }
  return{
    viewModel: TimeoutModel,
    template: html
  }
})
