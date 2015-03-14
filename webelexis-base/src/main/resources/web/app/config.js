define(['knockout'], function (ko) {
    return {
        eventbusUrl: "http://localhost:2015/eventbus",
        homepage: "http://github.com/rgwch/webelexis",
        sessionID: ko.observable(null),
        connected: false,
        loc: {ip: "0.0.0.0"},
        mainMenu: [],
        modules: [
            {
                baseUrl: "#agenda",
                match: /^agenda$/,
                title: 'Agenda',
                component: 'ch-webelexis-agenda',
                location: 'components/agenda',
                active: true,
                menuItem: true
        },
            {
                baseUrl: "#patlist",
                match: /^patlist$/,
                title: 'Patienten',
                component: 'ch-webelexis-patlist',
                location: 'components/patlist',
                active: true,
                menuItem: true
        },
            {
                baseUrl: "#patid",
                match: /^patid$/,
                title: "Patient",
                component: 'ch-webelexis-patdetail',
                location: 'components/patdetail',
                menuItem: true,
                active: true

        },
            {
                baseUrl: "#kons",
                match: /^kons$/,
                title: "Konsultation",
                location: 'components/consultation',
                component: 'ch-webelexis-consdetail',
                menuItem: true,
                active: false
        },
            {
                baseUrl: "#login",
                match: /^login$/,
                title: "Webelexis-Anmeldung",
                component: 'ch-webelexis-login',
                location: 'components/login',
                active: true,
                menuItem: false
        },
            {
                title: 'page404',
                component: 'ch-webelexis-page404',
                location: 'components/page404',
                active: true,
                menuItem: false
        },
            {
                component: 'ch-webelexis-menubar',
                location: 'components/menubar',
                active: true
            }

    ]
    }

});