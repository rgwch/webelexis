import { PLATFORM } from 'aurelia-framework';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Patient } from './../../models/patient';
export default{
    stammdaten: {
      text: "Stammdaten",
      icon: "/static/id-card.svg", //basic.png",
      view: PLATFORM.moduleName("../../components/workflow/patient-basedata")
    },
    konsultationen:{
      text: "Konsultationen",
      icon: "/static/folder.svg", //karteikarte.jpg",
      view: PLATFORM.moduleName("../../components/workflow/encounters")
    },
    dokumente:{
      text: "Dokumente",
      icon: "/static/file.svg", // documents.png",
      view: PLATFORM.moduleName("../../components/document")
    },
    medikamente:{
      text: "Medikamente",
      icon: "/static/pill.svg", // prescriptions.png"
    },
    labor:{
      text: "Labor",
      icon: "/static/laboratory.svg"
    },
    patientenliste:{
      text: "Patienten",
      icon: "/static/users.svg",
      view: PLATFORM.moduleName("../patient/index"),
      linksTo: "stammdaten"
    },
    artikelliste:{
      text: "Artikel",
      icon: "/static/pill.svg",
      view: PLATFORM.moduleName("../artikel/index"),
      linksTo: "artikeldetail"
    },
    dokumentliste:{
      text: "Dokumente",
      icon: "/static/file.svg",
      view: PLATFORM.moduleName("../documents/list"),
      linksTo: "dokumente"
    },
    agendagross:{
      text: "Agenda",
      icon: "/static/calendar.svg",
      view: PLATFORM.moduleName("../agenda/index")
    },
    artikeldetail: {
      text: "Artikel",
      icon: "/static/pill.svg",
      view: PLATFORM.moduleName("../../components/workflow/artikeldetail")
    }
  }
