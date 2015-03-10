/*!
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap": "lib/bootstrap.min",
        "jquery": "lib/jquery.min",
        "knockout": "lib/knockout",
        "sockjs": "lib/sockjs.min",
        "text": "lib/text",
        "vertxbus": "lib/vertxbus",
        "app": "app"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "knockout": {
            deps: ["jquery"]
        }
    },  
};