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
        route: ['', 'termine(/:day)'],
        hash: '#termine',
        title: R.t('m.termine.title'),
        location: 'agenda/public',
        nav: 1,
        active: true,
        role: "guest"
      },
      {
        route: 'detail(/:day)',
        hash: '#detail',
        title: R.t('m.agenda.title'),
        location: 'agenda/detail',
        nav: 2,
        active: true,
        role: "arzt"
      },
      {
        route: 'findpat(/:query)',
        hash: "#findpat",
        title: R.t('m.patient.title'),
        location: 'patient/find',
        nav: 3,
        active: true,
        role: "arzt"
      },
      {
        route: "patdetail/:id",
        title: R.t('m.patient.title'),
        nav: false,
        location: 'patient/detail',
        active: true,
        role: "arzt"
      },
      {
        route: 'login',
        title: R.t("global.login"),
        location: 'account/login',
        nav: false,
        active: true,
        role: "guest"
      },
      {
        route: 'addpatient',
        title: R.t("m.add.account"),
        location: "account/create",
        nav: false,
        active: true,
        role: "guest"
      }, {
        route: 'labview(/:patid)',
        hash: '#labview',
        title: (R.t('lab.title')),
        location: "labview/labview",
        active: true,
        role: "arzt"
      }, {
        route: 'alert/:heading/:body',
        title: R.t("alerts:title"),
        location: 'alert/module',
        active: true,
        role: "guest"
      }

    ]
  }

});
