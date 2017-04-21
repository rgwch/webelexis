/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {FHIR_Resource, FhirBundle} from '../common/models/fhir'
import {MongoClient} from 'mongodb'
import {User} from "../models/user";
let nconf = require('nconf')


export interface NoSQL {
  getAsync(datatype: string, query: any): Promise<FHIR_Resource>
  queryAsync(datatype: string, query: any): Promise<Array<FHIR_Resource>>
  putAsync(fhir: FHIR_Resource): Promise<void>
  deleteAsync(datatype:string,id:string)
}
export class MongoDB implements NoSQL {
  private url: string
  private static dbInstance
  private db

  constructor() {
    this.url = nconf.get('mongodb').url
    MongoClient.connect("mongodb://" + this.url, (err, db) => {
      if (err) {
        throw(err)
      }
      MongoDB.dbInstance = this
      this.db=db
    })
  }

  public static getInstance(){
    return MongoDB.dbInstance
  }

  
  public getUser(uid:string): Promise<User>{
    let collection=this.db.collection("webelexis-users")
    return collection.findOne({uid:uid}).then(result=>{
      return new User(result)
    })
  }

  public writeUser(user:User):Promise<void>{
    let collection=this.db.collection("webelexis-users")
    return collection.updateOne({uid:user.uid},user,{upsert:true})
  }
  public getAsync(datatype: string, query): Promise<FHIR_Resource> {
    let collection = this.db.collection(datatype)
    return collection.findOne(query)

  }

  public async queryAsync(datatype: string, query: {}): Promise<Array<FHIR_Resource>> {
    let collection = this.db.collection(datatype)
    let cursor = await collection.find(query)
    return cursor.toArray()
  }

  public putAsync(fhir: FHIR_Resource): Promise<void> {
    let collection = this.db.collection(fhir.resourceType)
    delete fhir["_id"]
    return collection.updateOne({id:fhir.id},fhir,{upsert:true})
    // return collection.insertOne(fhir)
  }

  public async deleteAsync(datatype:string, id:string) {
    let collection = this.db.collection(datatype)
    return collection.deleteOne({id:id})
  }
}
