/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { Patient } from './../models/patient';
import { ViewerConfiguration } from './../components/commonviewer';
import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';

/**
 * Dialog to select a patient
 */
@autoinject
export class SelectPatient {
  cv: ViewerConfiguration = {
    title: "Patient Auswahl",
    dataType: 'patient',
    searchFields: [{
      name: "$find",
      label: "Name, Vorname oder Geburtsdatum",
      asPrefix: false,
      value: ""
    }],
    createDef: Patient.getDefinition(),
    getLabel: (obj) => Patient.getLabel(obj),
  }
  patient = {}

  constructor(private dc: DialogController) { }


}
