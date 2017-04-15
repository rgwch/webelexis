/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {DialogController} from 'aurelia-dialog'
import {autoinject} from "aurelia-framework";
import {I18N} from 'aurelia-i18n'
import {FHIR_Patient} from "../models/fhir";
import {FHIR_HumanName} from "../models/fhir";
import {FHIR_ContactPoint} from "../models/fhir";
import * as moment from 'moment'
import {FHIR_Address} from "../models/fhir";

@autoinject
export class CreatePerson {
  constructor(private controller: DialogController, private i18n: I18N) {
  }

  private ret = {
    "firstname": "",
    "lastname" : "",
    "birthdate": "",
    "street"   : "",
    "zip"      : "",
    "place"    : "",
    "phone"    : ""
  }

  collect() {

    let name: FHIR_HumanName = <FHIR_HumanName>{
      "use"   : "usual",
      "family": this.ret.lastname.trim().split(" "),
      "given" : this.ret.firstname.trim().split(" "),
    }
    let comm: FHIR_ContactPoint = <FHIR_ContactPoint>{
      "system": "phone",
      "value" : this.ret.phone,
      "rank"  : 1
    }
    let zipplace = this.ret.place.split(" ")
    let adr: FHIR_Address = {
      "line"      : [this.ret.street],
      "city"      : zipplace.length > 1 ? zipplace[1] : zipplace[0],
      "postalCode": zipplace.length > 1 ? zipplace[0] : ""
    }
    let patient: FHIR_Patient = {
      "resourceType": "Patient",
      "id"          : "1",
      "name"        : [name],
      "telecom"     : [comm],
      "birthDate"   : moment(this.ret.birthdate, 'DD-MM-YYYY').format(),
      "address"     : [adr]
    }
    this.controller.ok(patient)
  }
}
