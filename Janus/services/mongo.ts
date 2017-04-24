/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {FHIR_Resource} from "../common/models/fhir";
import {MongoClient} from "mongodb";
import {InternalUser as User} from "../models/user";
let nconf = require('nconf')


export interface NoSQL {
  getAsync(datatype: string, query: any): Promise<FHIR_Resource>
  queryAsync(datatype: string, query: any): Promise<Array<FHIR_Resource>>
  putAsync(fhir: FHIR_Resource): Promise<void>
  deleteAsync(datatype: string, id: string)
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
      this.db = db
    })
  }

  public static getInstance() {
    return MongoDB.dbInstance
  }


  public async getUserBy(template) {
    if (template) {
      let collection = this.db.collection("webelexis-users")
      let results = await collection.find(template)
      if (results.count > 1) {
        throw new Error("result not unique")
      }
      let result = await results.next()
      if (result) {
        return new User(result)
      } else {
        return null
      }
    } else {
      throw new Error("illegal access")
    }
  }

  public async getUserById(id: string) {
    let collection = this.db.collection("webelexis-users")
    let result = await  collection.findOne({id: id})
    return result ? new User(result) : null
  }

  public async getUserByMail(mail: string) {
    let collection = this.db.collection("webelexis-users")
    let result = await collection.findOne({"emails.value": mail.toLocaleLowerCase()})
    return result ? new User(result) : null
  }

  public writeUser(user: User): Promise<void> {
    let collection = this.db.collection("webelexis-users")
    return collection.updateOne({id: user.id}, user, {upsert: true})
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
    return collection.updateOne({id: fhir.id}, fhir, {upsert: true})
    // return collection.insertOne(fhir)
  }

  public async deleteAsync(datatype: string, id: string) {
    let collection = this.db.collection(datatype)
    return collection.deleteOne({id: id})
  }
}
