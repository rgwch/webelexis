import { Etcd3, Namespace } from 'etcd3'

export class Blob {
  private client
  private ns: Namespace
  constructor(private options) {
    const cfg = this.options.cfg
    this.client = new Etcd3()
    this.ns = this.client.namespace(cfg?.namespace || "Webelexis")


  }
  async get(id, params) {
    return this.ns.get(id)
  }
  async update(id, data, params) {
    return this.ns.put(id).value(data.blob)
  }

  async remove(id, params) {
    return this.ns.delete().key(id)
  }

}