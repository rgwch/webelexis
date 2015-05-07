/*!
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */
var require = {
  baseUrl: ".",
  paths: {
    "bootstrap": "lib/bootstrap.min",
    "jquery": "lib/jquery.min",
    "jquery-ui": "lib/jquery-ui",
    "validate": "lib/jquery.validate.min",
    "knockout": "lib/knockout",
    "sockjs": "lib/sockjs.min",
    "text": "lib/text",
    "vertxbus": "lib/vertxbus",
    "knockout-jqueryui": "lib/knockout-jqueryui",
    "cookie": "lib/js.cookie-1.5.0.min",
    "chart": "lib/Chart.min",
    "bus": "app/eb",
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
