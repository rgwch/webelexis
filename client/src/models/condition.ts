/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIRobject, FhirObjectFactory} from "./fhirobj";
import {FHIR_Resource} from "./fhir";
import {computedFrom} from "aurelia-framework";

export class ConditionFactory implements FhirObjectFactory {
  entities: Array<string> = ["asserter", "body-site", "category", "clinicalstatus",
    "code", "date-recorded", "encounter", "evidence", "identifier",
    "onset", "onset-info", "patient", "severity", "stage"]

  subtype: string = "Condition"

  createObject(fhir: FHIR_Resource): FHIRobject {
    return new Condition(fhir);
  }

}
export class Condition extends FHIRobject {

  constructor(fhir: FHIR_Resource) {
    super(fhir, "Condition")
  }
}
