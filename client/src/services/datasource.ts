/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/


/**
 * DataSource and DataService are the abstract concept of Webelexis' transport layer.
 * DataSource is able to authenticate a user with the source and to retrieve DataServices.
 *
 * A DataService is able to apply CRUD operations on objects of known data types.
 */

export interface DataService {
  // retrieve an object by ID
  get(index: string, params?: any): any
  // find objects by query expression
  find(params?): any
  // create an object
  create(data): any
  // update an object with id
  update(index, obj): any
  // delete an object
  remove(index): any
  // send an event concerning an object
  emit(topic,msg)
  // subscribe on events concerning this DataService's data type
  on(topic,func)
  // unsubscribe some topics
  off(topic,func)
  // get transport name for this DataService's data type
  path: string
}

export interface IDataSource {
  // Get a DataService for a given data type
  getService(name: string): DataService
  // get the data type of a given DataService
  dataType(service: DataService): string
  // authenticate
  login(username?:string,password?:string): Promise<any>
  // de-authenticate
  logout(): Promise<any>
}

/**
 * Dummy-Implementation of IDataSource
 */
export class DataSource implements IDataSource {
  getService(name: string): DataService {
    throw new Error("No DataSource is configured");
  }

  dataType(service: DataService): string {
    throw new Error("No DataSource is configured");
  }

  login(un?,pw?){
    return Promise.reject("No DataSource is configured");
  }

  logout(){
    return Promise.reject("No DataSource is configured");
  }

}
