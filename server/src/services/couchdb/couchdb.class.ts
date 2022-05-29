import { logger } from '../../logger'
import fetch from 'node-fetch'

export class CouchDB {
  private header = {
    "Content-type": "application/json"
  }
  private url
  constructor(private app, private options) {
    this.url = `http://${options.username}:${options.password}@${options.host}:${options.port}`
  }

  private async query(addr: string): Promise<any> {
    if (!addr.startsWith("/")) {
      addr = "/" + addr
    }
    const result = await fetch(this.url + addr)
    if (result.ok) {
      return await result.json()
    } else {
      throw new Error(result.statusText)
    }
  }
  private async send(addr: string, method: string, body: any) {
    if (!addr.startsWith("/")) {
      addr = "/" + addr
    }
    const result = await fetch(this.url + addr, { headers: this.header, method, body: JSON.stringify(body) })
    return result.json()
  }
  async checkInstance(): Promise<boolean> {
    try {
      const data = await this.query("/")
      if (data) {
        logger.info("Connected with CouchDB " + data.version)
        const dbs: Array<string> = await this.query("/_all_dbs")
        console.log(JSON.stringify(dbs))
        return true
      }
    } catch (err) {
      logger.error("CouchDB: " + err)
      return false
    }
  }

  async createDatabase(dbname: string): Promise<boolean> {
    try {
      const result = await this.send("/" + dbname, "put", {})
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
    const result = await this.query(id)
    return result
  }
  async create(obj): Promise<any> {
    const ident: Array<string> = obj.id?.split("/")
    if (!ident?.length) {
      throw new Error("bad id for create")
    }
    const dbs: Array<string> = await this.query("/_all_dbs")
    if (!dbs.includes(ident[0])) {
      const db = await this.createDatabase(ident[0])
    }
    const result = await this.send(obj.id, "put", obj)
    if (!result.ok) {
      logger.error(JSON.stringify(result))
      throw new Error(result.reason)
    } else {
      return obj
    }

  }
  async update(id, data, params?) {
    const obj = await this.get(id)
    const result = await this.send(id + "?rev=" + obj._rev, "put", data)
    if (!result.ok) {
      logger.error("CouchDB update: " + JSON.stringify(result))
      throw new Error(result.reason)
    } else {
      return data
    }
  }
  async remove(id, params?) {
    const ident: Array<string> = id.split("/")
    if (ident.length == 2) {
      // delete document
      const obj = await this.get(id)
      const result = await this.send(id + "?rev=" + obj._rev, "delete", { rev: obj._rev })
      if (result.ok) {
        return obj
      } else {
        logger.error("Couch delete: " + JSON.stringify(result))
        return undefined
      }
    } else {
      // delete database
      const result = await this.send(id, "delete", {})
      return result
    }
  }

}
