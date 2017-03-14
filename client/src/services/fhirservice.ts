/**********************************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************************/

import {HttpWrapper} from './http-wrapper';
import {inject} from "aurelia-framework";
import {Validator} from './validator'
import {FHIRobject} from '../models/fhirobj'
import {FHIR_Resource} from "../models/fhir";
import {DataStore} from './data-store'
import {HttpResponseMessage} from "aurelia-http-client";
import {FhirBundle} from "../models/fhir";
import {FhirObjectFactory} from "../models/fhirobj";

export interface BundleResult {
  status: "ok" | "error"
  message?: string
  values?: Array<FHIRobject>
  count: number
  links?: Array<any>

}
export interface SearchTerm {
  entity: string,
  value: string
}

@inject(HttpWrapper, DataStore)
export class FhirService {

  constructor(protected http:HttpWrapper, private cache:DataStore) {
  }

  public extractBundle(bundle:FhirBundle):Array<FHIR_Resource> {
    return bundle.entry.map(be => {
      return be.resource
    })
  }

//  filterBy(subtype: string, entity: string, searchterm: string, entities: Array<String>): Promise<FhirBundle> {
  filterBy(factory:FhirObjectFactory, terms:Array<SearchTerm>):Promise<BundleResult> {
    let modi = "_format=json"
    terms.forEach(term => {
      if (!factory.entities.find(cand => {
          return (cand == term.entity)
        })) {
        throw new Error(`Bad entity ${term.entity} for filter in subtype ${factory.subtype}`)
      }
      modi += `&${term.entity}=${term.value}`
    })

    return this.http.get(`${factory.subtype}?${modi}`).then(data => {
      if (!data) {
        return undefined
      }
      let checked = Validator.checkFHIRBundle(data, factory)
      return checked
    }).catch(err => {
      console.log(err)
    })
  }

  public getBatch(url:string, factory:FhirObjectFactory):Promise<BundleResult> {
    return this.http.get(url).then(result => {
      return Validator.checkFHIRBundle(result, factory)
    })
  }

  public getByUri(uri:string):Promise<FHIR_Resource> {
    let parts = uri.split(/\//)
    if (parts.length == 2) {
      return this.getById(parts[0], parts[1])
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error("malformed url"))
      })
    }

  }

  public getById(subtype:string, id:string):Promise<FHIR_Resource> {
    let fo = this.cache.fetch(id, subtype)
    if (typeof fo == 'undefined') {
      return this.http.get(`${subtype}/${id}?_format=json`).then(result => {
        if (!result) {
          return undefined
        }
        if (typeof result == 'string') {
          result = JSON.parse(result)
        }
        this.cache.push(result)
        return result;
      })
    } else {
      return new Promise(function (resolve) {
        resolve(fo)
      })
    }

  }

  public create(subtype:string, data?:FHIR_Resource):Promise<FHIR_Resource> {
    let fhir:FHIR_Resource = data
    if (!fhir) {
      fhir = {
        "resourceType": subtype,
        "id": "dummy"
      }
    }
    delete fhir.id
    return this.http.post(`${subtype}?_format=json`, fhir).then(result => {
      this.cache.push(<FHIR_Resource>result)
      return result
    })
  }

  public async update(fo:FHIR_Resource):Promise<FHIR_Resource> {
    let result = await this.http.put(`${fo["resourceType"]}/${fo.id}?_format=json`, fo)
    if (result['status'] && result['status'] === 'error') {
      alert(result['message'])
      return undefined
    } else {
      this.cache.push(result)
      return result
    }

  }

  public deleteObject(fo:FHIRobject):Promise<any> {
    return this.http.delete(`${fo.fhir.resourceType}/${fo.id}`).then(result => {

    })
  }

  public createUUID():string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  }


}
