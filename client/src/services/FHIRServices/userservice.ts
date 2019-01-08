import { UserType } from "models/user";
import { DataService, IQueryResult } from "services/datasource";

export class UserService implements DataService {
  public path: string;

  // retrieve an object by ID
  public get(index: string): UserType {
    return null;
  }

  // find objects by query expression
  public find(params?): IQueryResult {
    return null;
  }

  // create an object
  public create(data: UserType, params?): UserType {
    return null;
  }

  // update an object with id
  public update(index, obj): UserType {
    return null;
  }

  // Update only given attributes of an existing object
  public patch(index, obj): UserType {
    return null;
  }

  // delete an object (or several objects)
  public remove(index, params?): UserType {
    return null;
  }
  // send an event concerning an object
  public emit(topic: string, msg: any) {}
  // subscribe on events concerning this DataService's data type
  public on(topic: string, func: (obj: UserType) => {}) {}
  // unsubscribe some topics
  public off(topic: string, func: (obj: UserType) => {}) {}
  // get transport name for this DataService's data type
}
