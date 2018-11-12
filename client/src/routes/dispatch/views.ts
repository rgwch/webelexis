/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { PLATFORM } from 'aurelia-framework';

export default{
    stammdaten: {
      text: "Stammdaten",
      icon: "/id-card.svg", //basic.png",
      view: PLATFORM.moduleName("views/patient-basedata")
    },
    konsultationen:{
      text: "Konsultationen",
      icon: "/folder.svg", //karteikarte.jpg",
      view: PLATFORM.moduleName("views/encounters")
    },
    dokumente:{
      text: "Dokumente",
      icon: "/file.svg", // documents.png",
      view: PLATFORM.moduleName("views/document")
    },
    medikamente:{
      text: "Medikamente",
      icon: "/pill.svg", // prescriptions.png"
    },
    labor:{
      text: "Labor",
      icon: "/laboratory.svg",
      view: PLATFORM.moduleName("views/labresults")
    },
    patientenliste:{
      text: "Patienten",
      icon: "/users.svg",
      view: PLATFORM.moduleName("../patient/index"),
      linksTo: "stammdaten"
    },
    artikelliste:{
      text: "Artikel",
      icon: "/pill.svg",
      view: PLATFORM.moduleName("../artikel/index"),
      linksTo: "artikeldetail"
    },
    dokumentliste:{
      text: "Dokumente",
      icon: "/file.svg",
      view: PLATFORM.moduleName("../documents/list"),
      linksTo: "dokumente"
    },
    agendagross:{
      text: "Agenda",
      icon: "/calendar.svg",
      view: PLATFORM.moduleName("../agenda/index")
    },
    artikeldetail: {
      text: "Artikel",
      icon: "/pill.svg",
      view: PLATFORM.moduleName("views/artikeldetail")
    },
    messwerte:{
      text: "Messwerte",
      icon: "/checklist.svg",
      view: PLATFORM.moduleName("views/findings-view")
    }
  }
