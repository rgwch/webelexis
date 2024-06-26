module.exports = {
    configname: "dockered",
    version: "3.9.0",
    "testing": false,
    "host": "localhost",
    "port": process.env.WEBELEXIS_SERVER || 3030,
    "paginate": {
        "default": 50,
        "max": 500
    },

    /* connection to the Elexis database */
    elexisdb: {
        client: "mysql2",
        connection: {
            host: "elx_elexisdb",
            database: "elexisoob",
            user: "elexisuser",
            password: "elexis",
            port: 3306
        }
    },

    /**
     * Lucinda instance to use as document store
     */
    lucinda: {
        url: "http://localhost:9997/lucinda/3.0/"
    },
    /**
     * Lucinda needs also solr and tika, and a file store
     */
    solr: {
        host: "http://localhost:8983/solr",
        core: "elexisdata",
        idfield: "id",
        tika: "http://localhost:9998",
        filestore: "solr-docs",
        watch: true
    },
    /**
     * prefix and encryption settings for the blob store
     */
    blob: {
        // Depending on the implementation: Database or prefix
        namespace: "webelexis",
        // Must remain the same for all documents of this webelexis instance
        salt: "thisShouldBeAppSpec",
        // Password to encrypt blobs. If salt or pwd is not given: Don't encrypt blobs.
        pwd: "PleaseChangeThis",
        // indexer to look up documents. Useful especially, if encrypted
        indexer: "lucinda",
    },
    /**
     * Access configuration for CouchDB.
     */
    couchdb: {
        // if no db given in a request: Use defaultDB
        defaultDB: "webelexis",
        // Credential as defined in CouchDB
        username: "couchadmin",
        password: "pleasechangethis",
        host: "localhost",
        port: 5984

    },

    authentication: {
        entity: "user",
        service: "user",
        secret: "useSomethingInstanceSpecificHere",
        authStrategies: [
            "jwt",
            "local"
        ],
        jwtOptions: {
            header: {
                typ: "access"
            },
            audience: "https://webelexis.ch",
            issuer: "feathers",
            algorithm: "HS256",
            expiresIn: "1d"
        },
        local: {
            "usernameField": "id",
            "passwordField": "password"
        }
    },
    "nedb": "../../data",
    /* The name to show on the browser tab */
    sitename: "Praxis Webelexis",

    /* Admin's mail is needed for registering new users and for lost password retrieval */
    admin: "admin@praxis.invalid",
    url: "lostpassword@webelexis.ch",

    /* If the user database is empty, create an admin and assign this pasword. Make sure to remove the line
       after the first start. */
    adminpwd: "topsecret",
    /* create a proxy server at :4040 for appointment-self-service requests */
    self_service: true,

    /* A list of mandators and metadata for them. Metadata are used in templates. You can define whatever you want
       and refer to it e.g. in 'briefe' templates. See data/sample-docbase/templates/rezept.pug for an example. */
    mandators: {
        default: {
            name: "Heinrich Eisenbart",
            subtitle: "Facharzt für Elexik",
            street: "Hintergasse 17",
            place: "9999 Elexikon",
            phone: "05 55 55 55 55",
            email: "praxis@elexis.invalid",
            zsr: "F181314",
            gln: "7601440085924"
        }
    },

    /* The place to store templates and documents */
    docbase: "../../data/sample-docbase",


    /* We need an SMTP host to send mails for lost password retrieval */
    smtp: {
        host: "some.smpt.host",
        port: 587,
        user: "smtpuser",
        pwd: "smtppassword"
    },
    /**
     * Definition of default presets for appointments. Only needed if Webelexis
     * runs from scratch i.e. without a previously installed and configured Elexos.
     */
    agenda: {
        resources: ["Arzt", "MPA"],
        daydefaults: `FS1~#<ASa=A0000-0900
   1200-2359~#<ADo=A0000-0800
   1200-1300
   1700-2359~#<AFr=A0000-0800
   1200-1300
   1700-2359~#<AMi=A0000-0800
   1300-2359~#<ADi=A0000-0900
   1300-1400
   1800-2359~#<AMo=A0000-0800
   1200-1300
   1700-2359~#<ASo=A0000-2359`,
        termintypdefaults: ["Frei", "Reserviert", "Normal"],
        terminstatedefaults: ["-", "geplant", "eingetroffen", "fertig", "abgesagt"],
        typcolordefaults: {
            Reserviert: "000000",
            Frei: "80ff80",
            Normal: "ff8040"
        },
        statecolordefaults: {
            geplant: "ff8000",
            eingetroffen: "ff0000",
            fertig: "008000",
            abgesagt: "e5e5e5"
        },
        timedefaults: {
            Reserviert: 30,
            Frei: 30,
            Normal: 30
        }
    },
    /**
     * Settings for the self-service scheduling
     */
    schedule: {
        minDuration: 30,
        terminTyp: "Internet",
        resource: "Arzt",
        maxPerDay: 4,
        sitename: "Praxis Webelexis",
        siteaddr: "Hintergasse 17, 9999 Webelexikon",
        sitephone: "555-55 55 55",
        sitemail: "team@webelexis.ch"
    },
    /**
     * Preset for Fall settings
     */

    fall: {
        fallgesetz: "KVG",
        fallgrund: "Krankheit",
        fallbezeichnung: "Allg.",
    },
    /**
     * Settings for creating and mailing invoices
     */
    billing: {
        output: "/home/user/elexisdata/bills",
        printer: "Brother_HL_L2370DN_series",
        creditor: {
            name: "Praxis Webelexis",
            address: "Hintergasse 17",
            zip: 9999,
            city: "Elexikon",
            account: "CH63308080055445084711", // You'll need a real QR-Account IBAN to create bills.
            country: "CH"
        },
        datetime: "dd.LL.yyyy",
        stickerForMail: "Rechnung per Mail",
        invoiceHeading: "Honorar-Rechnung Nr. ",
        invoiceText: "Bitte reichen Sie den beigefügten Rückerstattungsbeleg Ihrer Krankenkasse ein und überweisen Sie den Rechnungsbetrag mit untenstehendem Einzahlungsschein.",
        reminder1Heading: "Zahlungserinnerung für Rn. Nr.",
        reminder1Text: "Ihre Zahlung ist noch nicht eingegangen",
        reminder2Heading: "Zweite Mahnung für Rn. Nr.",
        reminder2Text: "Bitte zahlen Sie innert 10 Tagen",
        reminder3Heading: "Dritte Mahnung für Rn. Nr.",
        reminder3Text: "Umgehende Zahlung",
        "Privat-Rechnung": {
            invoiceHeading: "Rechnung Nr. #",
            invoiceText: "Details siehe Folgeseite. Bitte um Überweisung innert 30 Tagen."
        }

    },
    /**
     * Definition of roles for different users. You can change the names and descriptions
     * freely. If you would like to change semantics and id, please make sure to
     * adapt src/mappings.ts accordingly
     */
    roles: {
        guest: {
            id: "guest",
            label: "Gast",
            descr: "a person not known to the system"
        },
        Patient: {
            id: "patient",
            label: "Patient",
            descr: "Someone who can see their own data only"
        },
        user: {
            id: "user",
            label: "Anwender",
            descr: "a person known to the system"
        },
        external: {
            id: "user_external",
            label: "externer Anwender",
            descr: "A user who can access remotely"
        },
        mpa: {
            id: "assistant",
            label: "MPA",
            descr: "a person working with the practice"
        },
        agenda: {
            id: "appnt",
            label: "Agenda",
            descr: "someone who may manage appointments"
        },
        doc: {
            id: "doctor",
            label: "Arzt",
            descr: "A doctor"
        },
        executive: {
            id: "executive_doctor",
            label: "Leitender Arzt",
            desc: "A doctor with administrative functions"
        },
        admin: {
            id: "admin",
            label: "Administrator",
            descr: "An administrator"
        },
        billing: {
            id: "billing",
            label: "Buchhaltung",
            desc: "Handling of invoices and payments"
        }
    }
}
