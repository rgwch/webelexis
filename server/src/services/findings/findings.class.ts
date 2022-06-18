/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
export type entity = {
  patientid: string
  name: string
  measurements: Array<{
    datetime: string,
    values: Array<string | number>
  }>
}

export class Finding {
  private nosql
  private database = "findings"
  private defaultdb
  constructor(private app, private options) {
    this.nosql = app.service("nosql")
    this.database = this.options.namespace || "findings"
    this.defaultdb = { query: { database: this.database } }
  }

  async get(id, params?): Promise<entity> {
    return this.nosql.get(id, this.defaultdb)
  }
  async find(params) {
    params.query = Object.assign({},this.defaultdb.query, params.query)
    return this.nosql.find(params)
  }

  async create(obj: entity, params?): Promise<entity> {
    params.query = Object.assign({},this.defaultdb.query, params.query)
    return this.nosql.create(obj, params)
  }
  async update(id: string, obj: entity, params?): Promise<entity> {
    params.query = Object.assign({},this.defaultdb.query, params.query)
    return this.nosql.update(id, obj, params)
  }
  async patch(id: string, obj: Partial<entity>, params?): Promise<entity> {
    params.query = Object.assign({},this.defaultdb.query, params.query)
    return this.nosql.patch(id, obj, params)
  }
  async remove(id: string, params?): Promise<entity> {
    params.query = Object.assign({},this.defaultdb.query, params.query)
    return this.nosql.remove(id, params)
  }
}