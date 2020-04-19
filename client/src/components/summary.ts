import { LogManager } from 'aurelia-framework';
import { IPatient } from './../models/patient-model';
import { bindable } from 'aurelia-framework';

const log=LogManager.getLogger("Summary View")


export class Summary{
  @bindable patient:IPatient
  kontaktdata:boolean = false
   
  attached(){
    // log.info("Summary attached: "+this.patient)
  }

  patientChanged(old,newp){
    // log.info("Change patient from "+(old ? old.bezeichnung1 : old)+" to "+(newp ? newp.bezeichnung1 : newp))
  }

}
