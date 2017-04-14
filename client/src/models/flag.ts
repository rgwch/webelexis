/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIR_Resource} from "./fhir";
import {FHIRobject, FhirObjectFactory} from "./fhirobj";

export class FlagFactory implements FhirObjectFactory {
  entities: Array<string> = ["author", "date", "encounter", "patient", "subject"]

  subtype: string = "Flag"

  createObject(fhir: FHIR_Resource): FHIRobject {
    return new Flag(fhir);
  }

}
export class Flag extends FHIRobject {
  constructor(fhir: FHIR_Resource) {
    super(fhir, "Flag")
  }
}
