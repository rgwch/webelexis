
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2023 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { Service } from 'feathers-knex'

export class Article extends Service {
  private app
  constructor(options, app) {
    options.name = "artikelstamm_ch"
    super(options)
    this.app = app
  }
  async get(id, params?): Promise<any> {
    let [scope, uid] = id.split("::")
    if (!uid) {
      uid = scope
      scope = "ch.elexis.data.Artikel"
    }
    const query = super.knex(scope).where("id", uid).select("*")
    const result = await query
    return result
  }
}
