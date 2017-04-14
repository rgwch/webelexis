/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {Refiner} from "./fhirsync";
import {FHIR_Resource,FHIR_Encounter,FHIR_Narrative} from '../common/models/fhir'
import {SQL} from '../services/mysql'
import * as moment from 'moment'
import {FhirObject} from '../models/fhirobject'
import * as xid from '../common/xid'
import {NoSQL} from "../services/mongo";

export class MedicationOrder extends FhirObject implements Refiner{
  dataType: string;

  constructor(sql:SQL,nosql:NoSQL){
    super(sql,nosql)
  }

  makeMongoQuery(parm: any): any {
    return undefined;
  }

  compare(a: FHIR_Resource, b: FHIR_Resource): number {
    return 0;
  }

  async fetchSQL(params: {}): Promise<Array<FHIR_Resource>> {
    return [];
  }

  async fetchNoSQL(params: any): Promise<Array<FHIR_Resource>> {
    return [];
  }

  pushSQL(fhir: FHIR_Resource): Promise<void> {
    return undefined;
  }

  async deleteObject(id:string){
    return false
  }
}