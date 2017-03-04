import {bindable, bindingMode, customElement} from 'aurelia-framework';
import {Encounter} from "../models/encounter";
import {FHIR_Resource} from "../models/fhir";

export class EncounterView {
  @bindable obj: Encounter
  @bindable large: boolean = false

  get editor() {
    return this.obj.getField('text.div')
  }

  set editor(contents: string) {
    this.obj.setField('text.div', contents)
  }

  bind(context, overide) {
    if (this.obj.fhir.resourceType !== "Encounter") {
      throw "bad object assignment"
    }
  }

  largeToggle() {
    this.large = !this.large

  }
}