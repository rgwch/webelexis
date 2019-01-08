import { PatientType } from "models/patient";
import { DataService, IQueryResult } from "services/datasource";

export class PatientService implements DataService {
  public path: string;

  // retrieve an object by ID
  public get(index: string): PatientType {
    return null;
  }

  // find objects by query expression
  public find(params?): IQueryResult {
    return null;
  }

  // create an object
  public create(data: PatientType, params?): PatientType {
    return null;
  }

  // update an object with id
  public update(index, obj): PatientType {
    return null;
  }

  // Update only given attributes of an existing object
  public patch(index, obj): PatientType {
    return null;
  }

  // delete an object (or several objects)
  public remove(index, params?): PatientType {
    return null;
  }
  // send an event concerning an object
  public emit(topic: string, msg: any) {}
  // subscribe on events concerning this DataService's data type
  public on(topic: string, func: (obj: PatientType) => {}) {}
  // unsubscribe some topics
  public off(topic: string, func: (obj: PatientType) => {}) {}
  // get transport name for this DataService's data type
}
