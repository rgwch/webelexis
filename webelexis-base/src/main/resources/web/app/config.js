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
            location: 'components/agenda',
            active: true,
            menuItem: true
        },
        patients: {
            baseUrl: "patlist",
            match: /^patlist$/,
            title: 'Patienten',
            component: 'ch-webelexis-patlist',
            location: 'components/patlist',
            active: true,
            menuItem: true
        },
        patient: {
            baseUrl: "patid",
            match: /^patid$/,
            title: "Patient",
            component: 'ch-webelexis-patdetail',
            location: 'components/patdetail',
            menuItem: true
        },
        kons: {
            baseUrl: "kons",
            match: /^kons$/,
            title: "Konsultation",
            location: 'components/consultation',
            component: 'ch-webelexis-consdetail',
            menuItem: true
        },
        login: {
            baseUrl: "login",
            match: /^login$/,
            title: "Webelexis-Anmeldung",
            component: 'ch-webelexis-login',
            location: 'components/login',
            active: true,
            menuItem: false
        },
        page404: {
            title: 'Seite nicht gefunden',
            match: '/^not found$/',
            component: 'ch-webelexis-page404',
            location: 'components/page404',
            active: true,
            menuItem: false
        }

    }
});