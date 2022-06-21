/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../../logger'
import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'

export class CouchDB {
  private url
  constructor(private app, private options) {
    this.url = `http://${options.username}:${options.password}@${options.host}:${options.port}`
  }

  async setup(app, path) {
    logger.debug("Couchdb setup at path "+path)
    const connect = await this.checkInstance()
    if (!connect) {
      process.exit(41)
    }

  }
  private async request(addr: string, database: string, method: "get" | "put" | "post" | "delete" = "get", body?: any): Promise<any> {
    const headers = {
      "Content-type": "application/json"
    }
    const options = {
      method,
      headers
    }
    if (body) {
      options["body"] = JSON.stringify(body)
    }
    const result = await fetch(this.url + "/" + database + "/" + addr, options)
    return await result.json()
  }

  async checkInstance(): Promise<boolean> {
    try {
      const data = await fetch(this.url + "/")
      if (data) {
        if (data.status === 401) {
          logger.error("Not authorized for CouchDB, Please check username/password")
          return false;
        }
        logger.info("Connected with CouchDB " + data.version)
        logger.info("Databases: " + JSON.stringify(this.listDatabases()))
        return true
      } else {
        logger.error("No data from CouchDB")
        return false;
      }
    } catch (err) {
      logger.error("Could not connect with CouchDB: " + err)
      return false
    }
  }

  async listDatabases(): Promise<Array<string>> {
    const result = await fetch(this.url + "/_all_dbs")
    if (result.ok) {
      return await result.json()
    } else {
      const explain = await result.json()
      throw new Error("CouchDB List databases: " + JSON.stringify(result) + ", " + JSON.stringify(explain));
    }

  }
  async createDatabase(dbname: string): Promise<boolean> {
    try {
      const result = await fetch(this.url + "/" + dbname, { method: "put" })
      if (result.ok) {
        return true
      } else {
        logger.error(JSON.stringify(result))
        return false;
      }
    } catch (err) {
      logger.error("CouchDB create DB: " + err)
      return false
    }
  }

  /**
   * Retrieve an object by its id
   * @param id id of the object to find
   * @param params params.query.database: Database to consider
   * @returns the object
   * @throws "not_found" if no object with the given id exists
   */
  async get(id, params?): Promise<any> {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    const result = await this.request(id, db)
    if (result.error) {
      throw new Error(result.error)
    }
    return result
  }
  async find(params): Promise<any> {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    delete params.query.database;
    const result = await this.request("_find", db, "post", { selector: params.query })
    if (result.error) {
      throw new Error(result.error)
    }
    return { data: result.docs, total: result.docs.length, skip: 0, limit: 100 }
  }
  /**
   * create a new entry. If object woth the same obj.id exists,throw error.
   * @param obj The object to store
   * @param params params.query.database: Database where it should be stored
   * @returns the newly created object
   */
  async create(obj, params?): Promise<any> {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    const dbs: Array<string> = await this.listDatabases()
    if (!dbs.includes(db)) {
      const ndb = await this.createDatabase(db)
    }
    if (!obj._id) {
      obj._id = obj.id || uuid()
    }
    const result = await this.request(obj._id, db, "put", obj)
    if (result.error) {
      logger.warn(result.error)
      throw new Error(result.error)
    } else {
      return obj
    }

  }
  /**
   * Update existing object. If no object with the given ID exists:
   * create new entry, if params.query.upsert is true, throw not_found otherwise.
   *
   * @param id id of the object to update
   * @param data the object
   * @param params,wuery.database, params params.query.upsert,
   * @returns the updated or newly created object
   */
  async update(id, data, params?) {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    try {
      const obj = await this.get(id, params)
      const result = await this.request(id + "?rev=" + obj._rev, db, "put", data)
      if (result.error) {
        logger.error("CouchDB update: " + JSON.stringify(result))
        throw new Error(result.reason)
      } else {
        data.rev = result.rev
        return data
      }
    } catch (err) {
      if (err.message === "not_found") {
        if (params?.query?.upsert) {
          const result = await this.create(data, params)
          return result
        } else {
          throw new Error("not_found")
        }
      }
    }
  }

  /**
   * Remove an object by its id or delete a database
   * @param id id of the object to remove. If id is "!database!": Delete the database in params.query.database
   * @param params params.query.database: Database where the object is located
   * @returns the newly deleted object
   */
  async remove(id, params?): Promise<any> {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    if (id !== "!database!") {
      // delete document
      const obj = await this.get(id, params)
      const result = await this.request(id + "?rev=" + obj._rev, db, "delete")
      if (result.ok) {
        return obj
      } else {
        logger.error("Couch delete: " + JSON.stringify(result))
        return undefined
      }
    } else {
      // delete database
      const result = await fetch(this.url + "/" + db, { method: "delete" })
      const ans = await result.json()
      return ans
    }
  }

}
