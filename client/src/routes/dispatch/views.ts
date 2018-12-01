/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { PLATFORM } from 'aurelia-framework';
import global from 'user/global'

export default{
    leistungen:{
      text: "Leistungen",
      icon: "/hand.svg",
      view: PLATFORM.moduleName("views/select-billing"),
      role: global.roles.billing
    },
    stammdaten: {
      text: "Stammdaten",
      icon: "/id-card.svg", //basic.png",
      view: PLATFORM.moduleName("views/patient-basedata"),
      role: global.roles.privacy
    },
    konsultationen:{
      text: "Konsultationen",
      icon: "/folder.svg", //karteikarte.jpg",
      view: PLATFORM.moduleName("views/encounters"),
      role: global.roles.privacy
    },
    dokumente:{
      text: "Dokumente",
      icon: "/file.svg", // documents.png",
      view: PLATFORM.moduleName("views/document"),
      role: global.roles.user
    },
    medikamente:{
      text: "Medikamente",
      icon: "/pill.svg", // prescriptions.png"
      role: global.roles.privacy
    },
    labor:{
      text: "Labor",
      icon: "/laboratory.svg",
      view: PLATFORM.moduleName("views/labresults"),
      role: global.roles.user
    },
    patientenliste:{
      text: "Patienten",
      icon: "/users.svg",
      view: PLATFORM.moduleName("../patient/index"),
      linksTo: "stammdaten",
      role: global.roles.privacy
    },
    artikelliste:{
      text: "Artikel",
      icon: "/pill.svg",
      view: PLATFORM.moduleName("../artikel/index"),
      linksTo: "artikeldetail",
      role: global.roles.mpa
    },
    dokumentliste:{
      text: "Dokumente",
      icon: "/file.svg",
      view: PLATFORM.moduleName("../documents/list"),
      linksTo: "dokumente",
      role: global.roles.user
    },
    agendagross:{
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
    messwerte:{
      text: "Messwerte",
      icon: "/checklist.svg",
      view: PLATFORM.moduleName("views/findings-view"),
      role: global.roles.user
    },
    medikation:{
      text: "Medikation",
      icon: "/pills.svg",
      view: PLATFORM.moduleName("views/prescriptions-view"),
      role: global.roles.user
    }
  }
