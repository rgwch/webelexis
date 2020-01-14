import { FHIR_Resource } from './../model/fhir';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { IFhirAdapter } from "fhir/fhir-api";
import { FhirBundle } from "fhir/model/fhir";
import { ElexisType } from "models/elexistype";
import { IQueryResult } from 'services/datasource';
import { BaseAdapter } from './base-adapter';

export class EmptyAdapter extends BaseAdapter {
  public toElexisObject(fhir: FHIR_Resource) : ElexisType {
    throw new Error("Method not implemented.");
  }
  public toFhirObject(obj: ElexisType): FHIR_Resource {
    throw new Error("Method not implemented.");
  }
  public toQueryResult(bundle: FhirBundle) : IQueryResult {
    throw new Error("Method not implemented.");
  }
  public path="Unknown"
}
