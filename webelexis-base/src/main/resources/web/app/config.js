define({
    eventbusUrl: "http://localhost:2015/eventbus",
    homepage: "http://github.com/rgwch/webelexis",
    sessionID: null,
    connected: false,
    modules: {
        agenda: {
            baseUrl: "agenda",
            match: /^agenda$/,
            title: 'Agenda',
            component: 'ch-webelexis-agenda',
            active: true,
            menuItem: true
        },
        patients: {
            baseUrl: "patlist",
            match: /^patlist$/,
            title: 'Patienten',
            component: 'ch-webelexis-patlist',
            active: true,
            menuItem: true
        },
        patient: {
            baseUrl: "patid",
            match: /^patid$/,
            title: "Patient",
            component: 'ch-webelexis-patdetail',
            menuItem: true
        },
        kons: {
            baseUrl: "kons",
            match: /^kons$/,
            title: "Konsultation",
            component: 'ch-webelexis-consdetail',
            menuItem: true
        },
        login: {
            baseUrl: "login",
            match: /^login$/,
            title: "Webelexis-Anmeldung",
            component: 'ch-webelexis-login',
            active: true,
            menuItem: false
        }
    }
});