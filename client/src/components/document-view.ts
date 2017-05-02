/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIR_Resource} from "../models/fhir";
import {bindable} from "aurelia-framework";
import {DocumentReference} from "../models/document-reference";

export class DocumentView{
  @bindable document: DocumentReference
  large:boolean=false

  bind(context, overide) {
    if (this.document.fhir.resourceType !== "DocumentReference") {
      throw "bad object assignment"
    }
  }

  largeToggle() {
    this.large = !this.large

  }
}