/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout','text!tmpl/ch-webelexis-timeout.html'],function(ko,html){
  function TimeoutModel(){

  }
  return{
    viewModel: TimeoutModel,
    template: html
  }
})
