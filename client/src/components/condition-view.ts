import {bindable} from "aurelia-framework";
import {FHIR_Resource} from "../models/fhir";
import {FHIR_Condition} from "../models/fhir";
import {Condition} from "../models/condition";

export class ConditionView{
  @bindable obj:Condition
  @bindable large:boolean=false

  bind(context,overide){
    if(this.obj.fhir.resourceType !== "Condition"){
      throw "bad object assignment"
    }
  }
  getTitle() : string{
    let fhir=this.obj.fhir as FHIR_Condition
    if(fhir.code && fhir.code.text){
      return fhir.code.text
    }else{
      return "unknown"
    }
  }

  largeToggle(){
    this.large=!this.large
  }
}
