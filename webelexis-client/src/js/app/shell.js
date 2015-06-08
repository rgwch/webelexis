/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(function (require) {
  var router = require('plugins/router');

  return {
    router: router,
    changePwd: function(){},
    connected: function(){
      return true
    },
    locale: function(text){
      return text
    },
    showLogin: function(){
      return true
    },
    showLogout: function(){
      return false
    },
    doLogout: function(){

    },

    activate: function () {
      router.map([
       { route: '', title:'Home', moduleId: 'hello/index', nav: true },
        { route: 'agenda', title: "Agenda", moduleId: 'agenda/module', nav: true}
      ]).buildNavigationModel();

      return router.activate();
    }
  };
});
