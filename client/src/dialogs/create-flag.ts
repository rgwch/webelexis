/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {DialogController} from 'aurelia-dialog'
import {autoinject} from "aurelia-framework";
import {FHIR_Flag} from "../models/fhir";
import {I18N} from 'aurelia-i18n'

@autoinject
export class CreateFlag {
  constructor(private controller:DialogController, private i18n:I18N) {
  }

  private codeSystems = [
    {
      "name": "XID",
      "value": "http://www.xid.ch/fhir/flags"
    },
    {
      "name": "LOINC",
      "value": "http://www.loinc.org"
    },
    {
      "name": "SNOMED",
      "value": "http;//www.snomed.org"
    },
    {
      "name": "HL7",
      "value": "http://hl7.org"
    }
  ]

  private category:string = "allgemein"
  private heading:string = ""
  private text:string = ""
  private codeSystem:string = "XID"
  private code:string = ""
  private categoryCodeSystem = "XID"
  private categoryCode = ""

  collect() {
    this.controller.ok({
      "cat": this.category,
      "text": this.text,
      "heading": this.heading,
      "codesystem": this.codeSystem,
      "code": this.code
    })
  }

}
