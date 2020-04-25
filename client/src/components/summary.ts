import { LogManager, autoinject, bindable, computedFrom } from 'aurelia-framework';
import { IPatient, PatientManager } from '../models/patient-manager';
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
    } as IAction,
    newKonsAction:{
      exec: this.newKons,
      name: "newkons",
      icon: "plus-circle green"
    } as IAction
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
