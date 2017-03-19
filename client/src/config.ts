/**
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {HttpWrapper} from "./services/http-wrapper";
import {inject} from "aurelia-framework";
import {Patient} from "./models/patient";

/**
 * The client tries do load configuration from the elexis server. If this fails, this file contains fallbacks.
 */
@inject(HttpWrapper)
export class Config {

  constructor(private http: HttpWrapper) {
    http.get("configuration").then(result => {
      if (result) {
        if (result.agenda) {
          this.agenda = result.agenda
        }
        if (result.general) {
          this.general = result.general
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }

  public systemState={
    selectedPatient:null,
    selectedDate:null,
    selectedActor:""
  }

  public resources = {
    server: "http://fhir2.healthintersections.com.au/open/",


  }


  public getAgendaType(name: string) {
    let cmp = name.toLocaleLowerCase()
    let type = this.agenda.types.find(tp => {
      if (tp['name'] && tp['name'].toLocaleLowerCase() === cmp) {
        return true;
      }
      if (tp['label'] && tp['label'].toLocaleLowerCase() === cmp) {
        return true
      }
    })
    if (type) {
      return type
    } else {
      return {
        "name"    : name,
        "fg"      : "black",
        "bg"      : "white",
        "duration": 15
      }
    }
  }

  public getAgendaState(name: string) {
    let cmp = name.toLocaleLowerCase()
    let state = this.agenda.states.find(tp => {
      if (tp['name'] && tp['name'].toLocaleLowerCase() === cmp) {
        return true;
      }
      if (tp['label'] && tp['label'].toLocaleLowerCase() === cmp) {
        return true
      }
    })
    if (state) {
      return state
    } else {
      return {
        "name" : name,
        "label": name,
        "fg"   : "black",
        "bg"   : "white",
      }
    }
  }

  public general = {
    officeName: "Webelexis",
    actors    : [
      {
        shortLabel: "joe",
        fullname  : "Dr. med. Johann Jodler",
        id        : "Practitioner/12345"
      },
      {
        shortLabel: "fred",
        fullname  : "Prof. Dr. Friedrich Friedensreich",
        id        : "Practitioner/6789"
      }
    ]
  }

  public agenda = {
    "types" : [
      {
        "name"    : "free",
        "label"   : "frei",
        "fg"      : "green",
        "bg"      : "green",
        "duration": 30
      },
      {
        "name"    : "unassignable",
        "label"   : "reserviert",
        "fg"      : "black",
        "bg"      : "black",
        "duration": 30
      },
      {
        "name"    : "normal",
        "fg"      : "black",
        "bg"      : "#f4c542",
        "duration": 30
      },
      {
        "name"    : "Extra",
        "fg"      : "white",
        "bg"      : "#f44242",
        "duration": 15
      },
      {
        "name"    : "Check-Up",
        "fg"      : "black",
        "bg"      : "#42f4dc",
        "duration": 45
      },
      {
        "name"  : "Besprechung",
        "fg"    : "black",
        "bg"    : "#42d7f4",
        duration: 30
      }
    ],
    "states": [
      {
        name : "proposed",
        label: "vorschlag",
        fg   : "black",
        bg   : "#d7f442"
      },
      {
        name : "pending",
        label: "hängig",
        fg   : "black",
        bg   : "#f4dc42"
      },
      {
        name : "booked",
        label: "geplant",
        fg   : "black",
        bg   : "#f4a142"
      },
      {
        name : "arrived",
        label: "eingetroffen",
        fg   : "black",
        bg   : "#ff6e5b"
      },
      {
        name : "fulfilled",
        label: "fertig",
        fg   : "black",
        bg   : "#4c91db"
      },
      {
        name : "cancelled",
        label: "abgesagt",
        fg   : "black",
        bg   : "#bcc4b6"
      },
      {
        name : "noshow",
        label: "verpasst",
        fg   : "black",
        bg   : "#f9ccf4"
      }

    ]
  }

}
