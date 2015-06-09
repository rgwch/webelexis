/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(function (require) {
  var router = require('plugins/router');

  return {
    router: router,
    changePwd: function () {
    },
    connected: function () {
      return true
    },
    locale: function (text) {
      return text
    },
    showLogin: function () {
      return true
    },
    showLogout: function () {
      return false
    },
    doLogout: function () {

    },

    activate: function () {
      router.map([
        {route: 'agenda', title: "Termine", moduleId: 'agenda/module', nav: 1},
        {route: 'detail', title: "Agenda", moduleId: 'detailagenda/module', nav: 2},
        {route: 'findpat', title: "Patient", moduleId: 'patients/module', nav: 3}
      ]).buildNavigationModel();

      return router.activate();
    }
  };
});
