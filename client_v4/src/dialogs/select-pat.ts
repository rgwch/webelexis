/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { IViewerConfiguration } from 'forms/commonviewer';
import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';
import { PatientManager } from 'models/patient-manager';

/**
 * Dialog to select a patient
 */
@autoinject
export class SelectPatient {
  cv: IViewerConfiguration = {
    title: "Patient Auswahl",
    dataType: 'patient',
    searchFields: [{
      name: "$find",
      label: "Name, Vorname oder Geburtsdatum",
      asPrefix: false,
      value: ""
    }],
    createDef: this.pm.getFieldDefinition(),
    getLabel: (obj) => this.pm.getLabel(obj),
  }
  patient = {}

  constructor(private dc: DialogController, private pm: PatientManager) { }


}
