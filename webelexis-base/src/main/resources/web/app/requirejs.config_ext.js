/*!
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */

/*
This is a variant of the original require.config.js to load libraries from an external server.
Use this, if your webelexis installation is located on a server with poor internet upstream speed.
The application will the load only its own code from there, but fetch larger libraries from
faster servers.
*/
var require = {
  baseUrl: ".",
  paths: {
    "bootstrap": "http://webelexis.ch/lib/bootstrap.min",
    "jquery": "http://webelexis.ch/lib/jquery.min",
    "jquery-ui": "http://webelexis.ch/lib/jquery-ui",
    "validate": "http://webelexis.ch/lib/jquery.validate.min",
    "knockout": "http://webelexis.ch/lib/knockout",
    "sockjs": "http://webelexis.ch/lib/sockjs.min",
    "text": "http://webelexis.ch/lib/text",
    "vertxbus": "http://webelexis.ch/lib/vertxbus",
    "knockout-jqueryui": "http://webelexis.ch/lib/knockout-jqueryui",
    "cookie": "http://webelexis.ch/lib/js.cookie-1.5.0.min",
    "R": "http://webelexis.ch/lib/R",
    "app": "app",
    "tmpl": "tmpl"
  },
  shim: {
    "bootstrap": {
      deps: ["jquery"]
    },
    "knockout": {
      deps: ["jquery"]
    },
    "validate": {
      deps: ["jquery"]
    }
  }
};
