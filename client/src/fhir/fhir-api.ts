/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, LogManager } from "aurelia-framework";
import env from "environment";
import { ElexisType } from "models/elexistype";
import { UserType } from "models/user";
import { DataService, IDataSource, IQueryResult } from "services/datasource";
import { AdapterFactory } from "./adapters/adapter-factory";
import { FhirService } from "./fhirservice";
import { FhirBundle, FHIR_Resource } from "./model/fhir";
const log = LogManager.getLogger("FHIR api")

/**
 * This is the FHIR compliant transport implementation for Webelexis (IDataSource and DataService)
 */

@autoinject
export class FhirDS implements IDataSource {

  private services: Map<string, DataService> = new Map()

  constructor(private fhir: FhirService) { }

  /**
   * retrieve or create a DataService
   * @param name Webelexis-Servicepath for the datatype to handle
   */
  public getService(name: string): DataService {
    let service = this.services.get(name)
    if (!service) {
      service = new FhirDataService(AdapterFactory.create(name), this.fhir);
      this.services.set(name, service)
    }
    return service;
  }
  /**
   * return the servicepath-name of a given service
   * @param service the service to query
   */
  public dataType(service: DataService) {
    return service.path;
  }

  /**
   * We can't really login to a FHIR Server like this, since the Smartclient uses an OAuth scheme to
   * authenticate. So we just return undefined to tell the session manager we're not logged in.
   */
  public async login(): Promise<UserType> {
    sessionStorage.removeItem("ch.webelexis.logintoken");
    return undefined;
  }

  public async logout() {
    //
  }

  /**
   * Retrieve Metadata of the FHIR Server. If successful, Metadata are stored in the global env.metadata
   */
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
  path: string
  toElexisObject(fhirObject: FHIR_Resource): ElexisType;
  toFhirObject(elexisObject: ElexisType): FHIR_Resource;
  toQueryResult(bundle: FhirBundle): IQueryResult;
  transformQuery(query: any): any
  resourceType(): string
}

/**
 * Query a FHIR Server with fhirclient api
 */
class FhirDataService implements DataService {
  // get transport name for this DataService's data type
  public path: string;
  private _smartclient;

  constructor(private adapter: IFhirAdapter, private fhir: FhirService) { }

  // retrieve an object by id
  public async get(index: string): Promise<ElexisType> {
    const smart = await this.smart()
    const fhir = await smart.api.read({ type: this.adapter.resourceType(), id: index })
    const res = this.adapter.toElexisObject(fhir)
    return res;
  }

  // find objects by query expression
  public async find(params?): Promise<IQueryResult> {
    const smart = await this.smart()
    try {
      const query = {
        query: params ? this.adapter.transformQuery(params.query) : {},
        type: this.adapter.resourceType()
      }
      const result = await smart.api.search(query)
      if (result.status === "success") {
        return this.adapter.toQueryResult(result.data);
      } else {
        throw new Error(result)
      }
    } catch (err) {
      log.error("Resourcetype %s not found or error %s", this.adapter.resourceType(), err)
      return {
        data: [],
        limit: 50,
        skip: 0,
        total: 0,
      }
    }
  }

  // create an object
  public create(data: ElexisType, params?): Promise<ElexisType> {
    const fhirObj = this.adapter.toFhirObject(data)
    const entry = {
      resource: fhirObj
    }
    return new Promise<ElexisType>((resolve, reject) => {
      this.smart().then(smart => {
        smart.api.create(entry,
          (created: FHIR_Resource) => {
            resolve(this.adapter.toElexisObject(created))
          },
          error => {
            reject(error)
          })
      })

    })
  }

  // update an object with id
  public update(index, obj): ElexisType {
    return;
  }

  // Update only given attributes of an existing object
  public patch(index, obj): ElexisType {
    return null;
  }

  // delete an object (or several objects)
  public remove(index, params?): ElexisType {
    return null;
  }

  /**
   * The following three methods are part of the bidirectional data handling of Webelexis.
   * Since FHIR has no corresponding concept, we just leave them empty here. A possible 
   * imlementation could use caching and polling of objects and generating events here accordingly.
   */
  // send an event concerning an object
  public emit(topic: string, msg: any) {}
  // subscribe on events concerning this DataService's data type
  public on(topic: string, func: (obj: ElexisType) => {}) { }
  // unsubscribe some topics
  public off(topic: string, func: (obj: ElexisType) => {}) { }

  /**
   * Get the SmartClient. Probably the login and authoritation process is not yet finished when we
   * need this the first time, so we must return a Promise.
   */
  private async smart() {
    if (!this._smartclient) {
      this._smartclient = await this.fhir.getSmartclient()
    }
    return this._smartclient

  }
}
