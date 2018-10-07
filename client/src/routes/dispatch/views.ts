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
      icon: "/assets/id-card.svg", //basic.png",
      view: PLATFORM.moduleName("../../components/workflow/patient-basedata")
    },
    konsultationen:{
      text: "Konsultationen",
      icon: "/assets/folder.svg", //karteikarte.jpg",
      view: PLATFORM.moduleName("../../components/workflow/encounters")
    },
    dokumente:{
      text: "Dokumente",
      icon: "/assets/file.svg", // documents.png",
      view: PLATFORM.moduleName("../../components/document")
    },
    medikamente:{
      text: "Medikamente",
      icon: "/assets/pill.svg", // prescriptions.png"
    },
    labor:{
      text: "Labor",
      icon: "/assets/laboratory.svg"
    },
    patientenliste:{
      text: "Patienten",
      icon: "/assets/users.svg",
      view: PLATFORM.moduleName("../patient/index"),
      linksTo: "stammdaten"
    },
    artikelliste:{
      text: "Artikel",
      icon: "/assets/pill.svg",
      view: PLATFORM.moduleName("../artikel/index"),
      linksTo: "artikeldetail"
    },
    dokumentliste:{
      text: "Dokumente",
      icon: "/assets/file.svg",
      view: PLATFORM.moduleName("../documents/list"),
      linksTo: "dokumente"
    },
    agendagross:{
      text: "Agenda",
      icon: "/assets/calendar.svg",
      view: PLATFORM.moduleName("../agenda/index")
    },
    artikeldetail: {
      text: "Artikel",
      icon: "/assets/pill.svg",
      view: PLATFORM.moduleName("../../components/workflow/artikeldetail")
    }
  }
