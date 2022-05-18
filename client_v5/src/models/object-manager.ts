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
    query.$limit = 500
    do {
      result = await this.dataService.find({ query })
      ret = [...ret, ...result.data]
      query.$skip = result.skip + result.data.length
    } while (query.$skip < result.total)
    return ret
  }

  public async find(query: any): Promise<QueryResult> {

    return this.dataService.find(query)
  }
  /**
   * Delete Object
   * @param el
   * @returns the deleted object
   */
  public async remove(el: ElexisType) {
    return await this.dataService.remove(el.id)
  }
}
