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
    "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min",
    "jquery-ui": "lib/jquery-ui",
    "validate": "http://webelexis.ch/lib/jquery.validate.min",
    "knockout": "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min",
    "sockjs": "http://webelexis.ch/lib/sockjs.min",
    "text": "lib/text",
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
