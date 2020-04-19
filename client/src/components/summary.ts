import { LogManager, autoinject, bindable, computedFrom } from 'aurelia-framework';
import { IPatient, PatientManager } from './../models/patient-model';
import { IAction } from './collapse';

const log = LogManager.getLogger("Summary View")

@autoinject
export class Summary {
  @bindable patient: IPatient
  actions={
    newAppntAction: {
      exec: this.newAppnt,
      name: "new Appnt",
      icon: "calendar-alt"
    },
    newKonsAction:{
      exec: this.newKons,
      name: "newkons",
      icon: "plus-circle green"
    }
  }

  persActions=[this.actions.newAppntAction]
  konsActions=[this.actions.newKonsAction]

  constructor(private pam: PatientManager) {

  }

  newAppnt(){
    alert("new Appnt")
  }
  
  newKons(){
    alert("new KOns")
  }

  @computedFrom('patient')
  get label() {
    if (this.patient) {
      return this.pam.getLabel(this.patient)
    }
  }
}
