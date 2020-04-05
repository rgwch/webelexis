/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogController } from 'aurelia-dialog'
import { autoinject, bindable } from 'aurelia-framework';
import { FindingsModel } from 'models/findings-model';
import * as moment from 'moment'
moment.locale('de')

/**
 * Dialog to add a new measurement to a finding
 */
@autoinject
export class AddFinding{
  @bindable pickermoment=moment()
  finding:FindingsModel
  elements
  values={}

  constructor(private dc:DialogController){}

  activate(finding:FindingsModel){
    this.finding=finding
    this.elements=finding.getElements()
  }

  ok(){
    let r=[]
    for(const el of this.elements){
      r.push(this.values[el.title])
    }
  
    const dat=this.pickermoment.toDate()
    this.finding.addMeasurement(r,dat)
    this.dc.ok(this.finding)
  }
}
