/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { IUser} from '../models/user-model';
import {IElexisType, UUID} from '../models/elexistype'
import { IKontakt } from '../models/kontakt-model';
import { uuid } from 'uuidv4'


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
export class LocalDataService implements IDataService{
  constructor(name:string, private dataSource:LocalDataSource){
    this.path=name
  }
  get(index: UUID, params?: any) : Promise<IElexisType>{
    return this.dataSource.fetch(this.path,index)  
  }

  async find(params?: any) : Promise<IQueryResult>{
    const data= await this.dataSource.fetchAll(this.path)
    const ret=<IQueryResult>{
      data: data,
      limit: data.length,
      skip: 0,
      total: data.length
    }
    return ret
  }

  create(data: IElexisType, params?: any) : Promise<IElexisType>{
    return this.dataSource.store(this.path,data)
  }

  update(index: UUID, obj: IElexisType) : Promise<IElexisType>{
    obj.id=index
    return this.dataSource.store(this.path,obj)
  }

  patch(index: UUID, obj: any): Promise<IElexisType> {
    return this.dataSource.fetch(this.path,index).then(exist=>{
      return this.dataSource.store(this.path,Object.assign({},exist,obj))
    })
  }

  async remove(index: UUID, params?: any) : Promise<IElexisType>{
    return this.dataSource.delete(this.path,index)
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
  login?(username?: string, password?: string): Promise<IUser>
  // de-authenticate
  logout(): Promise<any>
  // give metadata about the server
  metadata(): Promise<any>
}

/**
 * Format of a find result from IDataService
 */
export interface IQueryResult {
  data: IElexisType[],    // the data
  limit: number,  // number of items in data
  total: number,  // total number of items
  skip: number    // skipped items for this query
}

/**
 * LocalStorage-Implementation of IDataSource
 */
export class LocalDataSource implements IDataSource {
  public getService(name: string): IDataService {
    return new LocalDataService(name, this)
  }

  public fetch(datatype: string, id: UUID) : Promise<IElexisType>{
    return new Promise((resolve,reject)=>{
      const bucket=JSON.parse(localStorage.getItem("webelexislocal_"+datatype) || "{}")
      const ret=bucket[id]
      if(ret){
        resolve(ret)
      }else{
        reject("not found")
      }
    })
  }

  public fetchAll(datatype: string) : Promise<IElexisType[]>{
    const bucket=JSON.parse(localStorage.getItem("webelexislocal_"+datatype) || "{}")
    return Promise.resolve(bucket)
  }

  store(datatype: string, obj: IElexisType) : Promise<IElexisType>{
    const bucket=JSON.parse(localStorage.getItem("webelexislocal_"+datatype) || "{}")
    obj.id=obj.id || uuid()
    bucket[obj.id]=obj
    localStorage.setItem("webelexislocal_"+datatype,JSON.stringify(obj))
    return Promise.resolve(obj)
  }


  public dataType(service: IDataService): string {
    return service.path
  }

  public delete(datatype: string, id: UUID) : Promise<IElexisType>{
    const bucket=JSON.parse(localStorage.getItem("webelexislocal_"+datatype) || "{}")
    const ret=bucket[id]
    delete bucket[id]
    localStorage.setItem("webelexislocal_"+datatype,JSON.stringify(bucket))
    return Promise.resolve(ret)
  }

  public login(un?: string, pw?: string): Promise<IUser> {
    return Promise.reject("No DataSource is configured");
  }

  public logout() : Promise<any>{
    return Promise.reject("No DataSource is configured");
  }

  public metadata(): Promise<any> {
    return Promise.reject("No DataSource is configured");
  }
}
