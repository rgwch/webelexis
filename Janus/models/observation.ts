import {FhirObject} from "./fhirobject";
import {Refiner} from "./fhirsync";
import {FHIR_Resource} from "../common/models/fhir";
import {NoSQL} from "../services/mongo";
import {SQL} from "../services/mysql";
export class Observation extends FhirObject implements Refiner{
  dataType: string;

  constructor(sql:SQL, nosql:NoSQL){
    super(sql,nosql)
  }

  compare(a: FHIR_Resource, b: FHIR_Resource): number {
    return undefined;
  }

  fetchSQL(params: {}): Promise<Array<FHIR_Resource>> {
    return undefined;
  }

  fetchNoSQL(params: any): Promise<Array<FHIR_Resource>> {
    return undefined;
  }

  pushSQL(fhir: FHIR_Resource): Promise<void> {
    return undefined;
  }

  deleteObject(id: string): any {
    return undefined;
  }

}