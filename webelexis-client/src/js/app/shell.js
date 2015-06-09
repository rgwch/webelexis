/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(function (require) {
  var router = require('plugins/router');
  var R = require('i18n')

  return {
    router: router,
    changePwd: function () {
    },
    connected: function () {
      return true
    },
    locale: function (text) {
      return R.t("global." + text)
    },
    showLogin: function () {
      return true
    },
    showLogout: function () {
      return false
    },
    doLogout: function () {

    },
    hasGoogle: function () {
      return false
    },

    activate: function () {
      router.map([
        {route: ['', 'agenda'], title: R.t('app:m.termine.title'), moduleId: 'agenda/module', nav: 1},
        {route: 'detail', title: R.t('app:m.agenda.title'), moduleId: 'detailagenda/module', nav: 2},
        {route: 'findpat', title: R.t('m.patient.title'), moduleId: 'patients/module', nav: 3},
        {route: 'login', title: R.t("global.login"), moduleId: 'login/module', nav: false},
        {route: 'addpatient', title: R.t("m.add.account"), moduleId: "addpatient/module", nav: false}
      ]).buildNavigationModel();

      return router.activate();
    }
  };
});
