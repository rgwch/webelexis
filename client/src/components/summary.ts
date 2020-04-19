import { LogManager, autoinject, bindable, computedFrom } from 'aurelia-framework';
import { IPatient, PatientManager } from './../models/patient-model';

const log = LogManager.getLogger("Summary View")

@autoinject
export class Summary {
  @bindable patient: IPatient
  kontaktdata: boolean = false

  constructor(private pam: PatientManager) {

  }

  toggleKontaktdata(){
    this.kontaktdata=!this.kontaktdata
  }
  
  attached() {
    // log.info("Summary attached: "+this.patient)
  }

  patientChanged(old, newp) {
    // log.info("Change patient from "+(old ? old.bezeichnung1 : old)+" to "+(newp ? newp.bezeichnung1 : newp))
  }

  @computedFrom('patient')
  get label() {
    if (this.patient) {
      return this.pam.getLabel(this.patient)
    }
  }
}
