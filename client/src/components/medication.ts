import { bindable } from "aurelia-framework";
import { PrescriptionManager, PrescriptionType } from "models/prescription-model";

export class Medication {
  @bindable obj

  constructor(private pm: PrescriptionManager) { }

  getLabel(o:PrescriptionType){
    if(o && o.Artikel){
      if(o.Artikel["DSCR"]){
        return o.Artikel["DSCR"]
      }
    }
    return "?"
  }
}
