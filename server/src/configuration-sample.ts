/**
 * Configuration example for the webelexis server
 * please move this file to configuration.ts and
 * change contents to match your system.
 *
 */
export const config = {
  /* if testing is true, webelexis will create some testusers on startup and allow to login without a password. */
  testing: true,
  /* The name to show on the browser tab */
  sitename: "Praxis Webelexis",
  /* Admin's mail is needed for registering new users and for lost password retrieval */
  admin: "someone@webelexis.ch",
  /* If the user database is empty, create an admin and assign this pasword. Make sure to remove the line
     after the first start. */
  adminpwd: "topsecret",
  /* create a proxy server at :4040 for appointment-self-service requests */
  self_service: true,
  /* A list of mandators and metadata for them. Metadata are used in templates. You can define whatever you want
     and refer to it e.g. in 'briefe' templates. See data/sample-docbase/templates/rezept.pug for an example. */
  mandators: {
    default: {
      name: "Dr. med. Dok Tormed",
      subtitle: "Facharzt für Webelexik",
      street: "Hinterdorf 17",
      place: "9999 Webelexikon",
      phone: "555 55 55",
      email: "doc@webelexis.org",
      zsr: "G088113",
      gln: "123456789012"
    }
  },
  /* The place to store templates and documents */
  docbase: "../data/sample-docbase",
  /* connection to the database */
  elexisdb: {
    host: "localhost",
    database: "elexiscopy",
    user: "elexisuser",
    password: "elexis",
    port: 3312
  },
  /* We need an SMTP host to send mails for lost password retrieval */
  smtp: {
    host: "some.smpt.host",
    port: 587,
    user: "smtpuser",
    pwd: "smtppassword"
  },
  /* Definition of the document store. Fallback is always
    storage in the file system */
  lucinda: {
    url: "http://localhost:2016/lucinda/2.0"
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
  billing: {
    output: "/path/to/pdf/bills",
    printer: "Brother_HL_L2370DN_series",
    creditor: {
      name: "Praxis Webelexis",
      address: "Hintergasse 17",
      zip: 9999,
      city: "Webelexikon",
      account: "CH007007007007", // You'll need a real QR-Account IBAN to create bills.
      country: "CH"
    },
    invoiceText: "Bitte reichen Sie den beigefügten Rückerstattungsbeleg Ihrer Krankenkasse ein und überweisen Sie den Rechnungsbetrag mit untenstehendem Einzahlungsschein."
  }
}
export const roles = {
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
  }
}

export const mappings = {
  [roles.guest.id]: ['stickers.find'],
  [roles.agenda.id]: ['termin'],
  [roles.mpa.id]: ['termin', 'article.find', 'auf.find', 'auf.create', 'auf.update',
    'billable.find', 'billing.create',
    'briefe', 'documents', 'fall', 'findings', 'konsultation', 'kontakt',
    'labresults', 'leistungsblock', 'lucinda', 'macros', 'meta-article',
    'patient', 'prescriptions', 'stickers', 'tarmed.find', 'tarmed.get'],
  [roles.doc.id]: ['billing'],
  [roles.user.id]: ['user.get']
}

// user role includes guest role and agenda rolw
mappings[roles.user.id] = [...mappings[roles.guest.id], ...mappings[roles.user.id], ...mappings[roles.agenda.id]]
// mpa role includes user role
mappings[roles.mpa.id] = [...mappings[roles.user.id], ...mappings[roles.mpa.id]]
// doctor role includes mpa role
mappings[roles.doc.id] = [...mappings[roles.mpa.id], ...mappings[roles.doc.id]]
