import { LogManager } from 'aurelia-framework';
import { IPatient } from './../models/patient-model';
import { bindable } from 'aurelia-framework';

const log=LogManager.getLogger("Summary View")
log.debug("Test")

export class Summary{
  @bindable patient:IPatient
   
  attached(){
    log.debug("Summary: "+this.patient)
  }

  patientChanged(old,newp){
    log.debug(old ? old.bezeichnung1 : old)
    log.debug(newp ? newp.bezeichnung1 : newp)
  }

}
