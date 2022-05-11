import { Etcd3, Namespace } from 'etcd3'
import { v4 as uuid } from 'uuid'
import { encrypt, decrypt } from '../../util/ziptool'

// https://microsoft.github.io/etcd3/classes/etcd3.html

type entity = {
  id: string
  data: string
}
export class Blob {
  private client
  private ns: Namespace
  constructor(private app, private options) {
    this.client = new Etcd3()
    this.ns = this.client.namespace(this.options.namespace || "Webelexis")
  }
  async get(id, params) {
    const zipped = await this.ns.get(id).buffer()
    if (!zipped) {
      throw new Error("Item not found")
    }
    const obj = await decrypt(zipped, this.options.pwd, this.options.salt)
    return JSON.parse(obj.toString())
  }
  async create(obj: any) {
    if (!obj.id) {
      obj.id = uuid()
    }
    const zipped = await encrypt(JSON.stringify(obj), this.options.pwd, this.options.salt)
    await this.ns.put(obj.id).value(zipped)
    if (this.options.indexer) {
      const indexer = this.app.service(this.options.indexer)
      if (indexer) {
        await indexer.create({ id: obj.id, contents: obj.data, type: "blob" })
      }
    }
    return obj.id
  }
  async update(id, data, params) {
    const zipped = await encrypt(JSON.stringify(data), this.options.pwd, this.options.salt)
    const prev = await (await this.ns.put(id).value(zipped).getPrevious())

    if (prev) {
      const val = prev.value
      const obj = await decrypt(val, this.options.pwd, this.options.salt)
      return JSON.parse(obj.toString())
    }

    return data
  }

  async remove(id, params) {
    if (this.options.indexer) {
      const indexer = this.app.service(this.options.indexer)
      if (indexer) {
        await indexer.remove(id)
      }
    }
    return this.ns.delete().key(id)
  }

}
