/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { v4 as uuid } from 'uuid'
import { encrypt, decrypt, encryptToBase64, decryptFromBase64 } from '../../util/ziptool'
import { logger } from '../../logger'

const encoding = "base64"
export type entity = {
  id?: string
  data: string
  z_ipped?: string
  [x: string]: any
}
export class Blob {
  private couch
  private ns: string
  private defaultdb
  constructor(private app, private options) {
    this.couch = app.service("couchdb")
    this.ns = (this.options.namespace || "webelexis")
    this.defaultdb = { query: { database: this.ns } }
  }
  private async transform(obj: entity) {
    if (obj.data) {
      if (this.options.pwd && this.options.salt) {
        obj.z_ipped = await encryptToBase64(obj.data, this.options.pwd, this.options.salt)
        delete obj.data
      }
    } else if (obj.z_ipped) {
      const dezipped: Buffer = await decryptFromBase64(obj.z_ipped, this.options.pwd, this.options.salt)
      obj.data = dezipped.toString("utf-8")
      delete obj.z_ipped
    }
    return obj
  }
  async get(id, params?): Promise<entity> {
    const obj: entity = await this.couch.get(id, this.defaultdb)
    return await this.transform(obj)
  }

  async create(ob: entity, params?): Promise<entity> {
    params = Object.assign(this.defaultdb, params)
    const created = Object.assign({}, ob)
    if (!created.id) {
      created.id = uuid()
    }
    if (this.options.indexer) {
      const indexer = this.app.service(this.options.indexer)
      if (indexer) {
        await indexer.create({ id: created.id, contents: created.data, type: "blob" })
      }
    }
    const transformed = await this.transform(created)
    const res = await this.couch.create(transformed, params)
    return await this.transform(res)
  }
  async update(id: string, obj: entity, params?): Promise<entity> {
    params = Object.assign(this.defaultdb, params)
    params.query = Object.assign(params.query, { upsert: true })
    const data = Object.assign({}, obj)
    const prev = await this.couch.update(id, await this.transform(data), params)
    return await this.transform(prev)
  }

  async remove(id: string, params?): Promise<entity> {
    if (this.options.indexer) {
      const indexer = this.app.service(this.options.indexer)
      if (indexer) {
        await indexer.remove(id, { query: { database: this.ns } })
      }
    }
    const obj = await this.couch.remove(id, { query: { database: this.ns } })
    return await this.transform(obj)
  }

}
