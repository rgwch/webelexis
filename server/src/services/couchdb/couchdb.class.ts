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

  async get(id, params) {

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
  async update(id, data, params) { }
  async remove(id, params) { }

}
