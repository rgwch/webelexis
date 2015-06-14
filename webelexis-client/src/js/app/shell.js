/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(['plugins/router', 'i18n', 'underscore', 'config', 'knockout', 'bus', 'bootstrap'], function (router, R, _, cfg, ko, bus) {

  var routes = function (roles) {
    var ret = []
    _.each(cfg.modules, function (module) {
      if (module.active) {
        if ((module.role === 'guest') || (roles.indexOf(module.role) !== -1)) {
          ret.push({
            route: module.route,
            title: module.title,
            moduleId: module.location,
            nav: module.nav
          })
        }
      }
    })
    return ret
  }

  var adaptForUser = function () {
    router.reset()
    router.map(routes(cfg.user().roles))
    router.buildNavigationModel()
    if (cfg.user().loggedIn) {
      $('#displayName').html(cfg.user().username + "<span class='caret'></span>")
    }

  }

  var clientID = $("meta[name='clientID']").attr("content")
  cfg.sessionID = $("meta[name='UUID']").attr("content")
  var state = $("meta[name='state']").attr("content")

  cfg.user.subscribe(function () {
    adaptForUser()
  })

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
    showLogin: ko.computed(function () {
      if (cfg.showLogin()) {
        if (!cfg.user().loggedIn) {
          return true
        }

      }
      return false
    }),
    showLogout: ko.computed(function () {
      if (cfg.showLogin()) {
        if (cfg.user().loggedIn) {
          return true
        }
      }
      return false
    }),
    doLogout: function () {
      if (cfg.google !== undefined) {
        cfg.google.signOut()
      }
      bus.send("ch.webelexis.session.logout", {
        sessionID: cfg.sessionID
      }, function (result) {
        bus.clearFeedbackAddress()
        cfg.user({
          "loggedIn": false,
          "roles": ["guest"],
          "username": ""
        })
        adaptForUser()
        if (result.status !== "ok") {
          system.log("Problem beim Abmelden " + result.message)
        }
        window.location.hash = "#"
        window.location.reload()
      })
    },
    hasGoogle: function () {
      return false
    },

    activate: function () {
      /*
      router.map([
        {route: ['', 'agenda'], title: R.t('app:m.termine.title'), moduleId: 'agenda/module', nav: 1},
        {route: 'detail', title: R.t('app:m.agenda.title'), moduleId: 'detailagenda/module', nav: 2},
        {route: 'findpat', title: R.t('m.patient.title'), moduleId: 'patients/module', nav: 3},
        {route: 'login', title: R.t("global.login"), moduleId: 'login/module', nav: false},
        {route: 'addpatient', title: R.t("m.add.account"), moduleId: "addpatient/module", nav: false}
      ]).buildNavigationModel();
       */
      var initialRoutes = routes(["guest"])
      router.map(initialRoutes).buildNavigationModel()
      return router.activate();
    }
  };
});
