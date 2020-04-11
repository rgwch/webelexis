import { StickynoteManager, IStickyNote } from './../models/stickynote-manager';
import { IPatient } from './../models/patient-model';

import { inlineView, bindable } from 'aurelia-framework';
import { IQueryResult } from 'services/dataservice';

@inlineView(`
<template>
  <div class="stickynotes" innerhtml.bind="notetext"></div>
</template>
`)
export class Notes{
  @bindable patient:IPatient
  notetext

  constructor(private stm: StickynoteManager){

  }
  patientChanged(newp, oldp){
    this.stm.find({patientid: newp.id}).then( (sn: IQueryResult<IStickyNote>)=>{
      if(sn.total>0){
        this.notetext=sn.data[0].html
      }
    })
  }

}
