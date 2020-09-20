/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { IViewerConfiguration } from 'forms/commonviewer';
import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';
import { PatientManager } from 'models/patient-manager';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator'
import { IKontakt } from 'models/kontakt-manager';

/**
 * Dialog to select a patient
 */
@autoinject
export class SelectPatient {
  cv: IViewerConfiguration = {
    title: "Patient Auswahl",
    dataType: 'patient',
    selectMsg: "newevent_slp",
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

  selectedPat: IKontakt
  subscr: Subscription

  constructor(private dc: DialogController, private pm: PatientManager, private ea: EventAggregator) {
    this.subscr = this.ea.subscribe(this.cv.selectMsg, item => {
      this.selectedPat = item
    })
  }

  detached() {
    this.subscr && this.subscr.dispose()
  }

  ok() {
    this.dc.ok(this.selectedPat)
  }

}
