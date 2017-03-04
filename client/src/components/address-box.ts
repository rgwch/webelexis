import {FHIR_Resource} from "../models/fhir";
import {bindable} from "aurelia-framework";

export class AddressBox{
  @bindable patient:FHIR_Resource
  private slider

  bind(context,over){
    this.slider.pause()
    this.slider.height="100px"
  }
}