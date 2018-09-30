/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { ViewerConfiguration } from '../../components/commonviewer'
import { autoinject } from 'aurelia-framework'
import { Patient } from '../../models/patient';
import { Router } from 'aurelia-router';

@autoinject
export class PatientView {
  isLocked=false
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
    handleError: (err)=>{
      if(err.code==401){
        this.router.navigateToRoute('user')
      }
    }

  }
  constructor(private router:Router){}
}
