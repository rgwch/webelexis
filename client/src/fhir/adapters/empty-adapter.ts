/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { IFhirAdapter } from "fhir/fhir-api";
import { FhirBundle } from "fhir/model/fhir";
import { ElexisType } from "models/elexistype";

export class EmptyAdapter implements IFhirAdapter {
  public toElexisObject(fhir: any) {
    throw new Error("Method not implemented.");
  }
  public toFhirObject(obj: ElexisType) {
    throw new Error("Method not implemented.");
  }
  public toQueryResult(bundle: FhirBundle) {
    throw new Error("Method not implemented.");
  }
}
