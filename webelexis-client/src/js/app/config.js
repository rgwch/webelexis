/**
 ** This file is part of Webelexis
 ** Copyright (c) by G. Weirich 2015
 */

define(['knockout', 'i18n'], function (ko, R) {

  return {

    // not really necessary in standard situations
    eventbusUrl: "http://localhost:2015/eventbus",
    // any page you want to be called with a click on the logo
    homepage: "http://github.com/rgwch/webelexis",
    // if false: The login field remains hidden
    showLogin: ko.observable(true),
    sessionID: "",
    user: ko.observable({
      "loggedIn": false,
      "roles": ["guest"],
      "username": "",
      "id_token": {}
    }),
    connected: ko.observable(false),
    loc: {
      ip: "0.0.0.0"
    },
    modules: [
      {
        route: ['', 'agenda'],
        title: R.t('app:m.termine.title'),
        location: 'agenda/module',
        nav: 1,
        active: true,
        role: "guest"
      },
      {
        route: 'detail',
        title: R.t('app:m.agenda.title'),
        location: 'detailagenda/module',
        nav: 2,
        active: true,
        role: "arzt"
      },
      {
        route: 'findpat',
        title: R.t('m.patient.title'),
        location: 'patients/module',
        nav: 3,
        active: true,
        role: "arzt"
      },
      {route: 'login', title: R.t("global.login"), location: 'login/module', nav: false, active: true, role: "guest"},
      {
        route: 'addpatient',
        title: R.t("m.add.account"),
        location: "addpatient/module",
        nav: false,
        active: true,
        role: "guest"
      }

    ]
  }

});
