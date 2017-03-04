/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {FHIR_Resource,FhirBundle} from '../../common/models/fhir'
import {MongoClient} from 'mongodb'
import * as nconf from 'nconf'


export interface NoSQL{
  getAsync(datatype:string,query:any):Promise<FHIR_Resource>
  queryAsync(datatype:string,query:any):Promise<Array<FHIR_Resource>>
  putAsync(fhir:FHIR_Resource):Promise<void>
}
export class MongoDB implements NoSQL{
  private url:string
  private db

  constructor(){
    this.url=nconf.get('mongodb').url
    MongoClient.connect("mongodb://" + this.url, (err, db)=> {
      if (err) {
        throw(err)
      }
      this.db = db
    })
  }

  public getAsync(datatype:string,query):Promise<FHIR_Resource>{
    let collection = this.db.collection(datatype)
    return collection.findOne(query)

  }

  public async queryAsync(datatype:string, query:{}):Promise<Array<FHIR_Resource>> {
    let collection = this.db.collection(datatype)
    let cursor = await collection.find(query)
    return cursor.toArray()
  }

  public putAsync(fhir:FHIR_Resource):Promise<void>{
    let collection = this.db.collection(fhir.resourceType)
    return collection.insertOne(fhir)
  }

}