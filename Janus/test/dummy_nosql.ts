/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {FHIR_Resource,FhirBundle} from '../common/models/fhir'
import {NoSQL} from "../services/mongo";

export class DummyDB implements NoSQL {
  private dummyObject
  private dummyStore = []

  constructor(dummyObject:FHIR_Resource, dummyquery:Array<any>) {
    this.dummyObject = dummyObject
    this.dummyStore = dummyquery
  }

  getData():Array<any> {
    return this.dummyStore
  }

  getAsync(datatype, query):Promise<any> {

    var result = query ? this.dummyObject : undefined
    var promise = new Promise(function (resolve, reject) {
      resolve(result)
    })
    return promise

  }

  queryAsync(datatype, query) {
    var result = this.dummyStore
    return new Promise(function (resolve, reject) {
      resolve(result)
    })
  }

  putAsync(fhir:FHIR_Resource):Promise<void> {
    this.dummyStore.push(fhir)
    return new Promise<void>((resolve, reject)=> {
      resolve()
    })
  }

  async deleteAsync(type:string,id:string){
    return true
  }
}
