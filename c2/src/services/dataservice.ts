/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { IUserType } from './../models/user-model';
import {IElexisType, UUID} from '../models/elexistype'
import * as faker from 'faker'

/**
 * IDataSource and IDataService are the abstract concept of Webelexis' transport layer.
 * IDataService is able to apply CRUD operations on objects of known data types.
 * IDataSource is able to authenticate a user with the source and to retrieve IDataServices.
 *
 */

export interface IDataService {
  /**
   * retrieve an object by ID
   * @param index: UUID/ElexisID of the object to retrieve
   * @returns resolve to the object or reject
   * */ 
  get(index: UUID, params?: any): Promise<IElexisType>

  // find objects by query expression
  find(params?): Promise<IElexisType[]>
  // create an object
  create(data, params?): Promise<IElexisType>
  // update an object with id
  update(index, obj): Promise<IElexisType>
  // Update only given attributes of an existing object
  patch(index, obj): Promise<IElexisType>
  // delete an object (or several objects)
  remove(index, params?): Promise<IElexisType>

  // send an event concerning an object
  emit(topic, msg)
  // subscribe on events concerning this DataService's data type
  on(topic, func)
  // unsubscribe some topics
  off(topic, func)
  // get transport name for this DataService's data type
  path: string
}

// dummy implementation of IDataService
export class DataService implements IDataService{
  get(index: string, params?: any) {
    throw new Error("Method not implemented.");
  }  find(params?: any) {
    throw new Error("Method not implemented.");
  }
  create(data: any, params?: any) {
    throw new Error("Method not implemented.");
  }
  update(index: any, obj: any) {
    throw new Error("Method not implemented.");
  }
  patch(index: any, obj: any) {
    throw new Error("Method not implemented.");
  }
  remove(index: any, params?: any) {
    throw new Error("Method not implemented.");
  }
  emit(topic: any, msg: any) {
    throw new Error("Method not implemented.");
  }
  on(topic: any, func: any) {
    throw new Error("Method not implemented.");
  }
  off(topic: any, func: any) {
    throw new Error("Method not implemented.");
  }
  path: string;


}

export interface IDataSource {
  // Get a DataService for a given data type
  getService(name: string): IDataService
  // get the data type of a given DataService
  dataType(service: IDataService): string
  // authenticate
  login?(username?: string, password?: string): Promise<IUserType>
  // de-authenticate
  logout(): Promise<any>
  // give metadata about the server
  metadata(): Promise<any>
}

/**
 * Format of a find result from IDataService
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
  public getService(name: string): IDataService {
    return new DataServic()
  }

  public dataType(service: IDataService): string {
    throw new Error("No DataSource is configured");
  }

  public login(un?: string, pw?: string): Promise<IUserType> {
    return Promise.reject("No DataSource is configured");
  }

  public logout() : Promise<any>{
    return Promise.reject("No DataSource is configured");
  }

  public metadata(): Promise<any> {
    return Promise.reject("No DataSource is configured");
  }
}
