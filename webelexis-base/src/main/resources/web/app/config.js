/**
 ** This file is part of Webelexis
 ** Copyright (c) by G. Weirich 2015
 */

define(['knockout'], function(ko) {

  return {

    // not really necessery in standard situations
    eventbusUrl: "http://localhost:2015/eventbus",
    // any page you want to be called with a click on the logo
    homepage: "http://github.com/rgwch/webelexis",
    // if false: The login field remains hidden
    showLogin: ko.observable(true),
    sessionID: "",
    user: ko.observable({
      "loggedIn": false,
      "roles": ["guest"],
      "username": ""
    }),
    connected: ko.observable(false),
    loc: {
      ip: "0.0.0.0"
    },
    mainMenu: [],

    /* Definition of modules to use. Note: The access rights are ultimately defined on the server side.
       So there's no point in activating a module here, if the user doesn't have respective rights on
       the server. Doing so would only result in a "dead" module. */
    modules: [{
        baseUrl: "#",
        match: /^$/, // regexp to match for this page
        title: 'Terminsuche', // title to display on this page's tab
        component: 'ch-webelexis-agenda', // name pof the component that creates this pages
        location: 'components/agenda', // location of the componant
        active: true, // to deactivate a component temporarily, set to 'false'
        menuItem: true, // if the component doesn't need a menu item, set to 'false
        role: "guest" // which user role is allowed to use this component.
          // again: The server side decides ultimately.
      }, {
        active: false,
        title: "Konsole",
        baseUrl: "#console",
        match: /^console$/,
        component: "ch-webelexis-console",
        location: "components/console",
        menuItem: true,
        role: "user"
      }, {
        baseUrl: "#agext",
        match: /^agext$/,
        title: "Agenda",
        component: 'ch-webelexis-detailagenda',
        location: 'components/detailagenda',
        active: true,
        menuItem: true,
        role: "user"
      }, {
        baseUrl: "#patlist",
        match: /^patlist$/,
        title: 'Patienten',
        component: 'ch-webelexis-patlist',
        location: 'components/patlist',
        active: false,
        menuItem: true,
        role: "user"
      }, {
        baseUrl: "#patid",
        match: /^patid\/(.+)\/?$/,
        title: "Patient",
        component: 'ch-webelexis-patdetail',
        location: 'components/patdetail',
        menuItem: true,
        active: true,
        role: "user"

      }, {
        baseUrl: "#kons",
        match: /^kons$/,
        title: "Konsultation",
        location: 'components/consultation',
        component: 'ch-webelexis-consdetail',
        menuItem: true,
        active: false,
        role: "user"
      }, {
        baseUrl: "#login",
        match: /^login$/,
        title: "Webelexis-Anmeldung",
        component: 'ch-webelexis-login',
        location: 'components/login',
        active: true,
        menuItem: false,
        role: "guest"
      }, {
        title: 'page404',
        component: 'ch-webelexis-page404',
        location: 'components/page404',
        active: true,
        menuItem: false,
        role: "guest"
      }, {
        component: 'ch-webelexis-menubar',
        location: 'components/menubar',
        active: true,
        role: "guest"
      }, {
        title: 'Konto erstellen',
        baseUrl: "#addpatient",
        match: /^addpatient$/,
        component: 'ch-webelexis-addpatient',
        location: 'components/addpatient',
        active: true,
        role: "guest",
        menuItem: false
      }

    ]
  }

});
