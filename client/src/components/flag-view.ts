import {FHIRobject} from "../models/fhirobj";
import {bindable} from "aurelia-framework";
export class FlagView{
  @bindable flag:FHIRobject
  @bindable large:boolean=false

  largeToggle(){
    this.large=!this.large

  }
}