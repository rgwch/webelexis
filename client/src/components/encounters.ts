import { EncounterManager } from 'models/encounter-model';
import { LogManager } from 'aurelia-framework';
import { IPatient } from './../models/patient-model';
import { IEncounter } from '../models/encounter-model';
import { bindable, autoinject } from 'aurelia-framework';
import { inlineView } from 'aurelia-framework';

const log=LogManager.getLogger('Encounters')

@inlineView(`
<template>
  <h2>Encounters</h2>
  <require from="./encounter"></require>
  <div class="encounters">
    <div virtual-repeat.for="encounter of encounters" infinite-scroll-next="next">
      <encounter konsultation.bind="encounter"></encounter>
    </div>
  </div>
</template>
`)
@autoinject
export class Encounters{
  @bindable patient
  encounters: Array<IEncounter>=[]

  constructor(private encm: EncounterManager){}

  patientChanged(newp:IPatient, oldp:IPatient){
    log.info("Patient changed")
    this.encounters=[]
    this.next(0,false,true)
  }
  next(topIndex:number,isAtBottom: boolean,isAtTop: boolean){
    log.info(`Called next with ${topIndex}, ${isAtBottom}, ${isAtTop}`)
    this.encm.find({patientId: this.patient.id, $skip:topIndex}).then(encs=>{
      this.encounters=encs.data
    })
  }


}
