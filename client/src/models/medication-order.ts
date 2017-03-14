/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIRobject, FhirObjectFactory} from "./fhirobj";
import {FHIR_Resource} from "./fhir";

export class MedicationOrderFactory implements FhirObjectFactory {
  subtype: string = "MedicationOrder"

  createObject(fhir: FHIR_Resource): FHIRobject {
    return new MedicationOrder(fhir);
  }

  entities = ["code", "datewritten", "encounter", "identifier", "medication", "patient", "prescriber", "status"]

}

export class MedicationOrder extends FHIRobject {
  constructor(fhir: FHIR_Resource) {
    super(fhir, "MedicationOrder")
  }
}
