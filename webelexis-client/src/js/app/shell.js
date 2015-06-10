/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(function (require) {
  var router = require('plugins/router'),
    R = require('i18n'),
    _ = require('underscore'),
    cfg = require('config')

  var routes = function (roles) {
    var ret = []
    _.each(cfg.modules, function (module) {
      if (module.active) {
        if ((module.role === 'guest') || (roles.indexOf(module.role) !== -1)) {
          ret.push({
            route: module.route,
            title: module.title,
            moduleId: module.locaction,
            nav: module.menuItem
          })
        }
      }
    })
  }
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
