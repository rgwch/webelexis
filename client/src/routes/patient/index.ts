/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ViewerConfiguration } from "../../components/commonviewer";
import { Patient } from "../../models/patient";

@autoinject
export class PatientView {
  public isLocked = false;
  public cv: ViewerConfiguration = {
    createDef: Patient.getDefinition(),
    dataType: "patient",
    getLabel: obj => Patient.getLabel(obj),
    handleError: err => {
      if (err.code === 401) {
        this.router.navigateToRoute("user");
      } else {
        console.log(err);
        alert("Server error");
      }
    },
    searchFields: [
      {
        asPrefix: false,
        label: "Name, Vorname oder Geburtsdatum",
        name: "$find",
        value: ""
      }
    ],
    title: "Patient Auswahl"
  };
  constructor(private router: Router) {}
}
