/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { UserType } from '../models/user-model';


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
  create(data, params?): any
  // update an object with id
  update(index, obj): any
  // Update only given attributes of an existing object
  patch(index, obj): any
  // delete an object (or several objects)
  remove(index, params?): any
  // send an event concerning an object
  emit(topic, msg)
  // subscribe on events concerning this DataService's data type
  on(topic, func)
  // unsubscribe some topics
  off(topic, func)
  // get transport name for this DataService's data type
  path: string
}

export interface IDataSource {
  // Get a DataService for a given data type
  getService(name: string): DataService
  // get the data type of a given DataService
  dataType(service: DataService): string
  // authenticate
  login?(username?: string, password?: string): Promise<UserType>
  // de-authenticate
  logout(): Promise<any>
  // give metadata about the server
  metadata(): Promise<any>
}

/**
 * Format of a find result from DataService
 */
export interface IQueryResult {
  data: any[],    // the data
  limit: number,  // number of items in data
  total: number,  // total number of items
  skip: number    // skipped items for this query
}

/**
 * Dummy-Implementation of IDataSource
 */
export class DataSource implements IDataSource {
  public getService(name: string): DataService {
    throw new Error("No DataSource is configured");
  }

  public dataType(service: DataService): string {
    throw new Error("No DataSource is configured");
  }

  public login(un?: string, pw?: string): Promise<UserType> {
    return Promise.reject("No DataSource is configured");
  }

  public logout() : Promise<any>{
    return Promise.reject("No DataSource is configured");
  }

  public metadata(): Promise<any> {
    return Promise.reject("No DataSource is configured");
  }
}
