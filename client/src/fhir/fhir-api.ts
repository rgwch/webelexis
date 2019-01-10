import { FHIR_Resource } from './model/fhir';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, LogManager } from "aurelia-framework";
import env from "environment";
import { ElexisType } from "models/elexistype";
import { User, UserType } from "models/user";
import { DataService, IDataSource, IQueryResult } from "services/datasource";
import { Session } from "services/session";
import { AdapterFactory } from "./adapters/adapter-factory";
import { FhirService } from "./fhirservice";
import { FhirBundle } from "./model/fhir";
import { Http2ServerResponse } from 'http2';
const log = LogManager.getLogger("FHIR api")
/**
 * This is the FHIR compliant transport implementation for Webelexis (IDataSource and DataService)
 * 
 */

@autoinject
export class FhirDS implements IDataSource {

  constructor(private fhir: FhirService) { }
  public getService(name: string): DataService {
    const service = new FhirDataService(AdapterFactory.create(name));
    return service;
  }
  public dataType(service: DataService) {
    return service.path;
  }

  /**
   * We can't really login to a FHIR Server like this, since the Smartclient uses an OAuth scheme to
   * authenticate. So we just return undefined to tell the session manager we're not logged in.
   * TODO: Login management needs rethink/rewrite
   */
  public async login(): Promise<UserType> {
    sessionStorage.removeItem("ch.webelexis.logintoken");
    return undefined;
  }

  public async logout() {
    //
  }

  public async metadata() {
    try {
      const result: any = await fetch(env.fhir.server_url + "/metadata?_format=json")
      const m = await result.json()
      env.metadata = m
      return m
    } catch (err) {
      log.error("Could not retrieve server metadata %s", err)
    }

  }
}
/**
 * Convert between FHIR Types and ElexisTypes
 */
export interface IFhirAdapter {
  toElexisObject(fhirObject: FHIR_Resource): ElexisType;
  toFhirObject(elexisObject: ElexisType): FHIR_Resource;
  toQueryResult(bundle: FhirBundle): IQueryResult;
  path: string
}

/**
 * Query a FHIR Server with the common format
 *   VERB [base]/[type]/[id] {?_format=[mime-type]}
 * e.g. GET /Patient/007?_format=json+fhir
 */
class FhirDataService implements DataService {
  // get transport name for this DataService's data type
  public path: string;
  constructor(private adapter: IFhirAdapter) { }

  // retrieve an object by ID (/TYPE/index)
  public async get(index: string): Promise<ElexisType> {
    const res: ElexisType = await this._fetch(this.adapter.path)
    return res;
  }

  // find objects by query expression
  public async find(params?): Promise<IQueryResult> {
    const result = await this._fetch(this.adapter.path, params.query)
    return this.adapter.toQueryResult(result);
  }

  // create an object
  public create(data: ElexisType, params?): ElexisType {
    const fhirtype=this.adapter.toFhirObject(data)
    return null
  }

  // update an object with id
  public update(index, obj): ElexisType {
    return null;
  }

  // Update only given attributes of an existing object
  public patch(index, obj): ElexisType {
    return null;
  }

  // delete an object (or several objects)
  public remove(index, params?): ElexisType {
    return null;
  }
  // send an event concerning an object
  public emit(topic: string, msg: any) { }
  // subscribe on events concerning this DataService's data type
  public on(topic: string, func: (obj: ElexisType) => {}) { }
  // unsubscribe some topics
  public off(topic: string, func: (obj: ElexisType) => {}) { }

  private async _fetch(suburl, parms?) {
    const path = `/${suburl}?_format?json` + parms ? "&" + parms : ""
    try {
      const res = await fetch(env.fhir.server_url + path)
      const decoded = await res.json()
      return decoded
    } catch (err) {
      log.error("Error while fetching %s, msg %s", path, err)
      return undefined
    }
  }
}
