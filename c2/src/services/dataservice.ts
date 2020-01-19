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

  /**
   * find objects by query expression
   * @param params 
   * @returns resolve to an IQueryResult
   */
  find(params?): Promise<IQueryResult>

  /**
   * create an object
   * @param data The object to create, without ID
   * @param params 
   * @returns resolve to the newly created object, with ID
   */
  
  create(data:IElexisType, params?): Promise<IElexisType>

  /**
   * update an object with id - complete replacement
   * @param index: UUID of the object to update
   * @param obj: The new Object definition
   * @returns resolve to the updated object (which is identical to obj)
   */
  
  update(index:UUID, obj:IElexisType): Promise<IElexisType>

  /**
   * Update only given attributes of an existing object
   * @param index UUID of the opject to patch
   * @param obj data to update. All attributes not given remain unchanged
   * @returns resove to the patched object (which is not identical to obj)
   */
  
  patch(index:UUID, obj:any): Promise<IElexisType>

  /**
   * delete an object (or several objects)
   * @param index UUID of the object to delete, or null
   * @param params  if index is null: A query expression as in find
   */
  remove(index:UUID, params?): Promise<IElexisType>

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
  get(index: UUID, params?: any) : Promise<IElexisType>{
    throw new Error("Method not implemented.");
  }

  find(params?: any) : Promise<IQueryResult>{
    throw new Error("Method not implemented.");
  }

  create(data: IElexisType, params?: any) : Promise<IElexisType>{
    throw new Error("Method not implemented.");
  }

  update(index: UUID, obj: IElexisType) : Promise<IElexisType>{
    throw new Error("Method not implemented.");
  }

  patch(index: UUID, obj: any): Promise<IElexisType> {
    throw new Error("Method not implemented.");
  }

  remove(index: UUID, params?: any) : Promise<IElexisType>{
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
    return new DataService()
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
