/*!
 ** This file is part of Webelexis.
 ** (c) 2015 by G. Weirich
 **/

/*
 * Main view switcher. Heavily inspired from https://github.com/lshift/knockout-routing
 */

define(['knockout', 'app/router', 'bootstrap'], function (ko, Router) {
    var urlMapping = {
        agenda: {
            match: /^$/,
            page: agendaPage
        },
        patients: {
            match: /^Pat$/,
            page: patList
        },
        patient: {
            match: /^patid$/,
            page: patDetail
        },
        kons: {
            match: /^kons$/,
            page: consPage
        }
    }

    ko.components.register('ch-webelexis-agenda', {
        viewModel: {
            require: 'component-agenda'
        },
        template: {
            require: 'text!component-agenda.html'
        }

    });

    function agendaPage() {
       
    }

    function patList() {
        return new Router.Page('Patienten', 'patlist-template', {});
    }

    function patDetail() {
        return new Router.Page('Patient Detail', 'patdetail-template', {});
    }

    function consPage() {
        return new Router.Page('Konsultation', 'cons-template', {});
    }

    function failPage() {
        return new Router.Page('Will it work?', 'simple-template', {
            error: ko.observable('Deliberate error!')
        });
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