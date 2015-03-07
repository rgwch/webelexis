/*!
 ** This file is part of Webelexis.
 ** (c) 2015 by G. Weirich
 **/

/*
 * Main view switcher. Heavily inspired from https://github.com/lshift/knockout-routing
 */

define(['knockout', 'app/router', 'bootstrap'], function (ko, Router) {

    ko.components.register('ch-webelexis-agenda', { require: 'components/agenda/ch-webelexis-agenda'});
    ko.components.register('ch-webelexis-patlist', { require: 'components/patlist/ch-webelexis-patlist'});
    ko.components.register('ch-webelexis-patdetail', { require: 'components/patdetail/ch-webelexis-patdetail'});
    ko.components.register('ch-webelexis-consdetail', { require: 'components/consultation/ch-webelexis-consdetail'});
    
    
    

    var urlMapping = {
        agenda: {
            match: /^$/,
            title: 'Agenda',
            component: 'ch-webelexis-agenda'
        },
        patients: {
            match: /^Pat$/,
            title: 'Patienten',
            component: 'ch-webelexis-patlist'
        },
        patient: {
            match: /^patid$/,
            title: "Patient",
            component: 'ch-webelexis-patdetail'
        },
        kons: {
            match: /^kons$/,
            title: "Konsultation",
            component: 'ch-webelexis-consdetail'
        }
    }


    // This is the KO ViewModel for the whole page, which contains our router, which
    // in turn keeps track of the current page.
    var topLevelModel = {
        router: new Router(urlMapping)
    };
    // Make model accessible in global context, purely to aid debugging.
    window.topLevelModel = topLevelModel

    // Need to explicitly bind to 'html' node if we want setting the page title to work.
    ko.applyBindings(topLevelModel, $('html').get(0));

});