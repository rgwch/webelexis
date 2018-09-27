/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import {connectTo} from 'aurelia-store'
import { autoinject, computedFrom } from 'aurelia-framework'
import { pluck } from 'rxjs/operators'
import {FlexformConfig, FlexFormValueConverter} from '../flexform'
import { I18N } from 'aurelia-i18n';
import {Patient} from '../../models/patient'
import { DataSource, DataService } from '../../services/datasource';

@autoinject
@connectTo(store=>store.state.pipe(pluck("patient")))
export class PatientBasedata {
  state
  def:FlexformConfig
  patientService:DataService

  constructor(private i18:I18N, private ds:DataSource){
    this.def=Patient.getDefinition();
    this.patientService=ds.getService('patient')
    this.patientService.on('updated',(obj)=>{
      this.state=obj
    })
  }



  @computedFrom('state')
  get title():string{
    if(!this.state){
      return "Kein Patient gewählt"
    }else{
      if(this.state.Bezeichnung1){
        return Patient.getLabel(this.state)
      }else{
        return "Neuer Patient"
      }
    }
  }


}
