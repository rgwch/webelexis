/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { PLATFORM } from 'aurelia-framework';
import global from 'user/global'

export default {
  dokumente: {
    icon: "/file.svg", 
    role: global.roles.user,
    text: "Dokumente",
    view: PLATFORM.moduleName("views/document")
  },
  konsultationen: {
    icon: "/folder.svg", 
    role: global.roles.privacy,
    text: "Konsultationen",
    view: PLATFORM.moduleName("views/encounters")
  },
  leistungen: {
    icon: "/hand.svg",
    role: global.roles.billing,
    text: "Leistungen",
    view: PLATFORM.moduleName("views/select-billing")
  },
  stammdaten: {
    icon: "/id-card.svg", 
    role: global.roles.privacy,
    text: "Stammdaten",
    view: PLATFORM.moduleName("views/patient-basedata")
  },
  medikamente: {
    text: "Medikamente",
    icon: "/pill.svg", 
    role: global.roles.privacy
  },
  labor: {
    text: "Labor",
    icon: "/laboratory.svg",
    view: PLATFORM.moduleName("views/labresults"),
    role: global.roles.user
  },
  patientenliste: {
    text: "Patienten",
    icon: "/users.svg",
    view: PLATFORM.moduleName("../patient/index"),
    linksTo: "stammdaten",
    role: global.roles.privacy
  },
  artikelliste: {
    text: "Artikel",
    icon: "/pill.svg",
    view: PLATFORM.moduleName("../artikel/index"),
    linksTo: "artikeldetail",
    role: global.roles.mpa
  },
  dokumentliste: {
    text: "Dokumente",
    icon: "/file.svg",
    view: PLATFORM.moduleName("../documents/list"),
    linksTo: "dokumente",
    role: global.roles.user
  },
  agendagross: {
    text: "Agenda",
    icon: "/calendar.svg",
    view: PLATFORM.moduleName("../agenda/index"),
    role: global.roles.agenda
  },
  artikeldetail: {
    text: "Artikel",
    icon: "/pill.svg",
    view: PLATFORM.moduleName("views/artikeldetail"),
    role: global.roles.doc
  },
  messwerte: {
    text: "Messwerte",
    icon: "/checklist.svg",
    view: PLATFORM.moduleName("views/findings-view"),
    role: global.roles.user
  },
  medikation: {
    text: "Medikation",
    icon: "/pills.svg",
    view: PLATFORM.moduleName("views/prescriptions-view"),
    role: global.roles.user
  },
  briefe: {
    text: "Briefe",
    icon: "/envelope.svg",
    view: PLATFORM.moduleName("views/letters-view")
  }
}
