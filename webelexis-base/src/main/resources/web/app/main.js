/*!
 ** This file is part of Webelexis.
 ** (c) 2015 by G. Weirich
 **/

/*
 * Main view switcher. Heavily inspired from https://github.com/lshift/knockout-routing
 */

define(['app/config', 'knockout', 'app/router', 'bootstrap'], function (config, ko, Router) {

    // Register KnockoutJS components
    ko.components.register('ch-webelexis-agenda', {
        require: 'components/agenda/ch-webelexis-agenda'
    });
    ko.components.register('ch-webelexis-patlist', {
        require: 'components/patlist/ch-webelexis-patlist'
    });
    ko.components.register('ch-webelexis-patdetail', {
        require: 'components/patdetail/ch-webelexis-patdetail'
    });
    ko.components.register('ch-webelexis-consdetail', {
        require: 'components/consultation/ch-webelexis-consdetail'
    });
    ko.components.register('ch-webelexis-login', {
        require: 'components/login/ch-webelexis-login'
    });
    ko.components.register('ch-webelexis-page404', {
        require: 'components/page404/ch-webelexis-page404'
    })

    var urlMapping = {}
    var modules = config.modules
    for (var key in modules) {
        var page = modules[key]
        if (page.active) {
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