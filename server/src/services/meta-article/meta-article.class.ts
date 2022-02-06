/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const LruCache = require('lru-cache')
/* eslint-disable no-unused-vars */
export class Service {
  private app
  private knex
  private lru

  constructor(private options = {}) {
    this.app = this.options['app']
    this.knex = this.app.get('knexClient')
    this.lru = new LruCache(250)
  }

  async find(params) {
    return []
  }

  async get(fid, params) {
    const [clazz, id] = fid.split('::')
    let result = this.lru.get(id || clazz)
    if (!result) {
      let art = await this.knex('artikel').where('id', id || clazz)
      if (art.length > 0) {
        const a = art[0]
        result = {
          id: a.id,
          lastupdate: a.lastupdate,
          type: 'X',
          bb: '0',
          gtin: a.ean,
          phar: a.subid,
          dscr: a.name,
          adddscr: a.name_intern,
          atc: a.atc_code,
          pexf: a.ek_preis,
          ppub: a.vk_preis,
          lieferantid: a.lieferantid,
          maxbestand: a.maxbestand,
          minbestand: a.minbestand,
          istbestand: a.istbestand,
        }
      } else {
        art = await this.knex('artikelstamm_ch').where('id', id || clazz)
        if (art.length > 0) {
          result = art[0]
        }
      }
      this.lru.set(id, result)
    }
    return result
  }
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return data
  }

  async update(id, data, params) {
    return data
  }

  async patch(id, data, params) {
    return data
  }

  async remove(id, params) {
    return { id }
  }
}

export default function (options) {
  return new Service(options)
}
