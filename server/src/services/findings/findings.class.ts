import { logger } from './../../logger';
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
    this.nosql.create({ _id: "created__", at: new Date().toString() }, this.defaultdb).catch(err => {
      const m = err.message
      if (m !== "conflict") {
        logger.error("Connection problem with CouchDB:" + err)

      } else {
        logger.warn("the previous warning can be ignored safely. (from: findings.class.ts)")
        logger.info("Findings: ensureExists database ok.")
      }
    })

  }

  async get(id, params?): Promise<entity> {
    return this.nosql.get(id, this.defaultdb)
  }
  async find(params) {
    params.query = Object.assign({}, this.defaultdb.query, params.query)
    return this.nosql.find(params)
  }

  async create(obj: entity, params?): Promise<entity> {
    params.query = Object.assign({}, this.defaultdb.query, params.query)
    return this.nosql.create(obj, params)
  }
  async update(id: string, obj: entity, params?): Promise<entity> {
    params.query = Object.assign({}, this.defaultdb.query, params.query)
    const updated = await this.nosql.update(id, obj, params)
    return updated
  }
  async patch(id: string, obj: Partial<entity>, params?): Promise<entity> {
    params.query = Object.assign({}, this.defaultdb.query, params.query)
    return this.nosql.patch(id, obj, params)
  }
  async remove(id: string, params?): Promise<entity> {
    params.query = Object.assign({}, this.defaultdb.query, params.query)
    return this.nosql.remove(id, params)
  }
}
