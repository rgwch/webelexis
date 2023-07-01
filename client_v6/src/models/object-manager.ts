/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID } from "./elexistype";
import { getService, type ServiceType } from "../services/io";
import type { QueryResult } from './query-result'

/**
 * Base class for all ElexisType- subtype managers
 */
export class ObjectManager {
  protected dataService

  constructor(service: ServiceType) {
    this.dataService = getService(service);
  }

  public subscribe(msg: "created" | "updated" | "patched" | "removed", func: (obj) => void) {
    this.dataService.on(msg, func)
  }

  public unsubscribe(msg: "created" | "updated" | "patched" | "removed", func: (obj) => void) {
    this.dataService.off(msg, func)
  }
  /**
   * Create or update (if exists) an object
   * Removes all client side helper attributes (starting with _)
   * bevore transmitting the object to the server.
   * @param el
   */
  public async save(el: ElexisType) {
    for (const attr in el) {
      if (el.hasOwnProperty(attr)) {
        if (attr.startsWith("_")) {
          delete el[attr];
        }
      }
    }
    if (el.id) {
      return await this.dataService.update(el.id, el);
    } else {
      return await this.dataService.create(el);
    }
  }

  /**
   * Fetch Object with given id
   * @param id
   * @returns the object or undefined if no such object was found
   */
  public async fetch(id: UUID): Promise<ElexisType> {
    try {
      return await this.dataService.get(id);
    } catch (err) {
      return undefined
    }
  }

  /**
   * Fetch all objects matching a query. Makes repeated requests if result size exceeds $limit
   * (Note: Hard limit of the server is set as paginate.max in server/config/*.json)
   * @param query Query in feathers-syntax
   * @returns an Array with the found objects
   */
  public async fetchAll(query: any): Promise<Array<ElexisType>> {
    let ret = []
    let result;
    query.$limit = 100
    do {
      result = await this.dataService.find({ query })
      ret = [...ret, ...result.data]
      query.$skip = result.skip + result.data.length
    } while (query.$skip < result.total)
    return ret
  }

  /**
   * Fetch all items for a given patient
   * @param id UUID of the patient

  public async fetchForPatient(id: UUID): Promise<Array<ElexisType>> {
    const result = await this.dataService.find({ query: { patientid: id } });
    if (result && result.data) {
      return result.data;
    } else {
      return []
    }
  }
  */
  public fetchForPatient(id: UUID, offset: number = 0, maxItems?: number): Promise<query_result> {
    if (id) {
      const query = { patientId: id, $skip: offset }
      if (maxItems) {
        query["$limit"] = maxItems
      }
      return this.dataService.find({ query })
    } else {
      return Promise.resolve({ total: 0, data: [], limit: 50, skip: 0 })
    }
  }

  public async find(query: any): Promise<QueryResult> {

    return this.dataService.find(query)
  }
  /**
   * Delete Object
   * @param el
   * @returns the deleted object
   */
  public async remove(el: ElexisType): Promise<ElexisType> {
    return await this.dataService.remove(el.id)
  }
}
