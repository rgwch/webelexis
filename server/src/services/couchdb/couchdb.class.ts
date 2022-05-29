import { logger } from '../../logger'
import fetch from 'node-fetch'

export class CouchDB {
  private url
  constructor(private app, private options) {
    this.url = `http://${options.username}:${options.password}@${options.host}:${options.port}`
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
        logger.info("Connected with CouchDB " + data.version)
        logger.info("Databases: " + JSON.stringify(this.listDatabases()))
        return true
      } else {
        logger.error("No data from CouchDB")
        return false;
      }
    } catch (err) {
      logger.error("CouchDB: " + err)
      return false
    }
  }

  async listDatabases(): Promise<Array<string>> {
    const result = await fetch(this.url + "/_all_dbs")
    if (result.ok) {
      return await result.json()
    } else {
      throw new Error("CouchDB List databases: " + JSON.stringify(result))
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

  async get(id, params?): Promise<any> {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    const result = await this.request(id, db)
    if (result.error) {
      throw new Error(result.error)
    }
    return result
  }
  async create(obj, params?): Promise<any> {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    const dbs: Array<string> = await this.listDatabases()
    if (!dbs.includes(db)) {
      const ndb = await this.createDatabase(db)
    }
    const result = await this.request(obj.id, db, "put", obj)
    if (!result.ok) {
      logger.error(JSON.stringify(result))
      throw new Error(result.reason)
    } else {
      return obj
    }

  }
  async update(id, data, params?) {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    const obj = await this.get(id, params)
    const result = await this.request(id + "?rev=" + obj._rev, db, "put", data)
    if (!result.ok) {
      logger.error("CouchDB update: " + JSON.stringify(result))
      throw new Error(result.reason)
    } else {
      return obj
    }
  }
  async remove(id, params?): Promise<any> {
    const db = params?.query?.database || this.options.defaultDB || "webelexis"
    if (id) {
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
