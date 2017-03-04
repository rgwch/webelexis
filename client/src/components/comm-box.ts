import {bindable} from "aurelia-framework";
import {FHIR_Resource} from "../models/fhir";
export class CommBox{
  @bindable patient:FHIR_Resource
}