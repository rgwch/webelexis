/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { DataService, DataSource } from "services/datasource";
import { ElexisType, UUID } from "./elexistype";
import { Container } from "aurelia-framework";

/**
 * Base class for all ElexisType- subtype managers
 */
export class ObjectManager {
  protected dataService: DataService;
  protected dataSource: DataSource

  constructor(serviceName: string) {
    this.dataSource = Container.instance.get(DataSource);
    this.dataService = this.dataSource.getService(serviceName);
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
  public async fetch(id: UUID) {
    try {
      return await this.dataService.get(id);
    } catch (err) {
      return undefined
    }
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
