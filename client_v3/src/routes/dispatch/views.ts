/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { PLATFORM } from "aurelia-framework";
import global from "user/global";

export default {
  agendagross: {
    icon: "/calendar.svg",
    role: global.roles.agenda,
    text: "Agenda",
    view: PLATFORM.moduleName("../agenda/index")
  },
  artikeldetail: {
    icon: "/pill.svg",
    role: global.roles.doc,
    text: "Artikel",
    view: PLATFORM.moduleName("views/artikeldetail")
  },
  artikelliste: {
    icon: "/pill.svg",
    role: global.roles.mpa,
    text: "Artikel",
    view: PLATFORM.moduleName("../artikel/index")
  },
  auf: {
    icon: "/paragraph.svg",
    role: global.roles.mpa,
    text: "Arbeitsunfähigkeit",
    view: PLATFORM.moduleName("views/auf")
  },
  brief:{
    icon: "/envelope.svg",
    role: global.roles.mpa,
    text: "Brief",
    view: PLATFORM.moduleName("views/letter-view")
  },
  briefe: {
    icon: "/envelope.svg",
    role: global.roles.mpa,
    text: "Briefe",
    view: PLATFORM.moduleName("views/letters-view")
  },
  dokumente: {
    icon: "/file.svg",
    role: global.roles.user,
    text: "Dokumente",
    view: PLATFORM.moduleName("views/document")
  },
  dokumentliste: {
    icon: "/file.svg",
    role: global.roles.user,
    text: "Dokumente",
    view: PLATFORM.moduleName("../documents/list")
  },
  konsultationen: {
    icon: "/folder.svg",
    role: global.roles.privacy,
    text: "Konsultationen",
    view: PLATFORM.moduleName("views/encounters")
  },
  labor: {
    icon: "/laboratory.svg",
    role: global.roles.user,
    text: "Labor",
    view: PLATFORM.moduleName("views/labresults")
  },
  leistungen: {
    icon: "/hand.svg",
    role: global.roles.billing,
    text: "Leistungen",
    view: PLATFORM.moduleName("views/select-billing")
  },
  medikamente: {
    icon: "/pill.svg",
    role: global.roles.privacy,
    text: "Medikamente"
  },
  medikation: {
    icon: "/pills.svg",
    role: global.roles.user,
    text: "Medikation",
    view: PLATFORM.moduleName("views/prescriptions-view")
  },
  messwerte: {
    icon: "/checklist.svg",
    role: global.roles.user,
    text: "Messwerte",
    view: PLATFORM.moduleName("views/findings-view")
  },
  patientenliste: {
    icon: "/users.svg",
    role: global.roles.privacy,
    text: "Patienten",
    view: PLATFORM.moduleName("../patient/index")
  },
  stammdaten: {
    icon: "/id-card.svg",
    role: global.roles.privacy,
    text: "Stammdaten",
    view: PLATFORM.moduleName("views/patient-basedata")
  },
  tagesliste: {
    icon: "/calendar.svg",
    text: "Tagesliste",
    view: PLATFORM.moduleName("views/encounters-by-date")
  }
};
