/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(function (require) {
  var router = require('plugins/router');

  return {
    router: router,
    activate: function () {
      router.map([
       // { route: '', title:'Home', moduleId: 'hello/index', nav: true },
        { route: '', title: "Agenda", moduleId: 'agenda/module', nav: true}
      ]).buildNavigationModel();

      return router.activate();
    }
  };
});
