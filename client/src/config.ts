/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {HttpWrapper} from "./services/http-wrapper";
import {inject} from "aurelia-framework";

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
        if (result.actors) {
          this.actors = result.actors
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }

  public resources = {
    server: "http://fhir2.healthintersections.com.au/open/",


  }

  public actors = [
    {
      label: "joe",
      display: "Dr. med. Johann Jodler",
      id: "Practitioner/12345"
    },
    {
      label: "fred",
      display: "Prof. Dr. Friedrich Friedensreich",
      id: "Practitioner/6789"
    }
  ]

  public getAgendaType(name:string){
    let type=this.agenda.types.find(tp=>{return (tp.name==name || tp.label==name)})
    if(type){
      return type
    }else{
      return {
        "name":name,
        "fg":"black",
        "bg":"white",
        "duration":15
      }
    }
  }
  public agenda = {
    "types": [
      {
        "name":"free",
        "label":"frei",
        "fg": "green",
        "bg": "green",
        "duration": 30
      },
      {
        "name":"unassignable",
        "label":"reserviert",
        "fg":"black",
        "bg":"black",
        "duration":30
      },
      {
        "label": "normal",
        "fg": "black",
        "bg": "#f4c542",
        "duration": 30
      },
      {
        "label": "Extra",
        "fg": "white",
        "bg": "#f44242",
        "duration": 15
      },
      {
        "label": "Check-Up",
        "fg": "black",
        "bg": "#42f4dc",
        "duration": 45
      },
      {
        "label": "Besprechung",
        "fg": "black",
        "bg": "#42d7f4",
        duration: 30
      }
    ],
    "states": [
      {
        name: "proposed",
        label: "vorschlag",
        fg: "black",
        bg: "#d7f442"
      },
      {
        name: "pending",
        label: "hängig",
        fg: "black",
        bg: "#f4dc42"
      },
      {
        name: "booked",
        label: "geplant",
        fg: "black",
        bg: "#f4a142"
      },
      {
        name: "arrived",
        label: "eingetroffen",
        fg: "black",
        bg: "#ff6e5b"
      },
      {
        name: "fulfilled",
        label: "fertig",
        fg: "black",
        bg: "#4c91db"
      },
      {
        name: "cancelled",
        label: "abgesagt",
        fg: "black",
        bg: "#bcc4b6"
      },
      {
        name: "noshow",
        label: "verpasst",
        fg: "black",
        bg: "#f9ccf4"
      }

    ]
  }

}
