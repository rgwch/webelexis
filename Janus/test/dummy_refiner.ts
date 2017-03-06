/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {Refiner} from "./../models/fhirsync";
import {FHIR_Resource} from '../common/models/fhir'

export class DummyRefiner implements Refiner {
  dataType:string = "DummyObject"
  private obj
  private fakeDB = []

  constructor(dummy:FHIR_Resource, dummyStore:Array<FHIR_Resource>, private nosql:Array<FHIR_Resource>) {
    this.obj = dummy
    this.fakeDB = dummyStore
  }
  getData():Array<FHIR_Resource>{

    return this.fakeDB
  }

  fetchNoSQL(params):Promise<Array<FHIR_Resource>> {
    return new Promise(resolve=> {
      if (params['obj']) {
        resolve(params.obj)
      } else {
        resolve(this.nosql)
      }
    })
  }

  makeMongoQuery(parm:any) {
    return {
      id: parm.id
    }
  }

  compare(a, b):number {
    return 0
  }

  fetchSQL(params:{}):Promise<Array<FHIR_Resource>> {
    return new Promise(resolve => {
      if (this.obj) {
        resolve([this.obj])
      } else {
        resolve(this.fakeDB)
      }
    })
  }

  pushSQL(fhir:FHIR_Resource):Promise<void> {
    this.fakeDB.push(fhir)
    return new Promise<void>((success, reject) => {
      success()
    })
  }
}