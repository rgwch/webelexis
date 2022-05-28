import { createClient } from 'redis'
import { v4 as uuid } from 'uuid'
import { encrypt, decrypt } from '../../util/ziptool'
import { logger } from '../../logger'

export type entity = {
  id?: string
  data: string
  [x: string]: any
}
export class Blob {
  private client
  private ns: string
  constructor(private app, private options) {
    this.client = createClient({ url: this.options.redis })
    this.ns = (this.options.namespace || "Webelexis") + ":"
    this.client.on('error', err => { logger.error("redis " + err) })
    this.client.connect().then(() => {
      logger.info("Redis connected")
    })
  }
  async get(id, params?) {
    /*
    const zipped = Buffer.from(await this.client.get(this.ns + id))
    if (!zipped) {
      throw new Error("Item not found")
    }
    const obj = await decrypt(zipped, this.options.pwd, this.options.salt)
    return JSON.parse(obj.toString("utf-8"))
    */
    const ret = await (this.client.get(this.ns + id))
    return { id, data: ret }
  }

  async create(obj: entity) {
    if (!obj.id) {
      obj.id = uuid()
    }
    /*
    const zipped = await encrypt(Buffer.from(JSON.stringify(obj)), this.options.pwd, this.options.salt)
    await this.client.set(this.ns + obj.id, zipped.toString("utf-8"))
    if (this.options.indexer) {
      const indexer = this.app.service(this.options.indexer)
      if (indexer) {
        await indexer.create({ id: this.ns + obj.id, contents: obj.data, type: "blob" })
      }
    }
    */
    const res = await this.client.set(this.ns + obj.id, obj.data)
    return obj.id
  }
  async update(id, data, params) {
    const zipped = await encrypt(Buffer.from(JSON.stringify(data)), this.options.pwd, this.options.salt)
    const prev = await this.get(this.ns + id)
    await this.create(data)
    return prev
  }

  async remove(id, params): Promise<number> {
    if (this.options.indexer) {
      const indexer = this.app.service(this.options.indexer)
      if (indexer) {
        await indexer.remove(this.ns + id)
      }
    }
    return await this.client.del(this.ns + id)
  }

}
