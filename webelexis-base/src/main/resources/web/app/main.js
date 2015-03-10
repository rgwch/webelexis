/*!
 ** This file is part of Webelexis.
 ** (c) 2015 by G. Weirich
 **/

/*
 * Main view switcher. Heavily inspired from https://github.com/lshift/knockout-routing
 */

define(['app/config', 'knockout', 'app/router', 'bootstrap'], function (config, ko, Router) {

    var urlMapping = {}
    var modules = config.modules
    for (var key in modules) {
        var page = modules[key]
        if (page.active) {
            ko.components.register(page.component, {
                require: page.location + '/' + page.component
            })
            urlMapping[key] = page
            if (page.menuItem) {
                $("#mainmenu").append('<li><a href="#' + page.baseUrl + '">' + page.title + '</a></li>')
            }
        }
    }
    // This is the KO ViewModel for the whole page, which contains our router, which
    // in turn keeps track of the current page.
    // if the user is not logged-in, they can only reach the login page.
    var topLevelModel = {
        router: new Router(urlMapping, function () {
            if (config.sessionID === null) {
                return new Router.Page('Anmelden', 'ch-webelexis-login')
            } else {
                return null
            }
        })
    };
    // Make model accessible in global context, purely to aid debugging.
    window.topLevelModel = topLevelModel

    // Need to explicitly bind to 'html' node if we want setting the page title to work.
    ko.applyBindings(topLevelModel, $('html').get(0));

});