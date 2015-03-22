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
        "knockout": "lib/knockout",
        "sockjs": "lib/sockjs.min",
        "text": "lib/text",
        "vertxbus": "lib/vertxbus",
        "domReady": "lib/domReady",
        "knockout-jqueryui": "lib/knockout-jqueryui",
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
    },
};