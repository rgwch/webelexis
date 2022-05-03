import { Etcd3, Namespace } from 'etcd3'
import { v4 as uuid } from 'uuid'
import { create, extract } from '../../util/ziptool'

// https://microsoft.github.io/etcd3/classes/etcd3.html

type entity = {
  id: string
}
export class Blob {
  private client
  private ns: Namespace
  constructor(private options) {
    const cfg = this.options.cfg
    this.client = new Etcd3()
    this.ns = this.client.namespace(cfg?.namespace || "Webelexis")


  }
  async get(id, params) {
    const zipped = await this.ns.get(id).buffer()
    if (!zipped) {
      throw new Error("Item not found")
    }
    const obj = await extract(zipped, id)
    return JSON.parse(obj)
  }
  async create(obj: any) {
    if (!obj.id) {
      obj.id = uuid()
    }
    const zipped = create(obj.id, JSON.stringify(obj))
    await this.ns.put(obj.id).value(zipped)
    return obj.id
  }
  async update(id, data, params) {
    const zipped = create(id, JSON.stringify(data))
    const prev = await (await this.ns.put(id).value(zipped).getPrevious())
    
    if(prev){
      const val=prev.value
      const obj=await extract(val,id)
      return JSON.parse(obj)
    }
    
    return data
  }

  async remove(id, params) {
    return this.ns.delete().key(id)
  }

}