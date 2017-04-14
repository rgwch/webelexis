/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIR_Resource} from './fhir'
import {FHIRobject, FhirObjectFactory} from "../models/fhirobj";

export class ScheduleFactory implements FhirObjectFactory {
  entities: Array<string> = ["actor", "date", /*identifier*/, "type"];
  subtype: string = "Schedule"

  createObject(fhir: FHIR_Resource): FHIRobject {
    return new Schedule(fhir);
  }

}
export class Schedule extends FHIRobject {

  constructor(fhir: FHIR_Resource) {
    super(fhir, "Schedule")
  }

}
