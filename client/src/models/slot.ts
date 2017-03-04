/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {FHIR_Resource} from './fhir'
import {FHIRobject, FhirObjectFactory} from "../models/fhirobj";

export class SlotFactory implements FhirObjectFactory{
  entities: Array<string>=["fb-type","schedule","slot-type","start"]
  subtype: string="Slot"

  createObject(fhir: FHIR_Resource): FHIRobject {
    return new Slot(fhir);
  }

}

export class Slot extends FHIRobject{

  constructor(fhir:FHIR_Resource){
    super(fhir,"Slot")
  }
}