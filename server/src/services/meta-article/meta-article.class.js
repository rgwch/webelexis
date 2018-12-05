const LruCache = require('lru-cache')
/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
    this.app = this.options.app
    this.knex = this.app.get("knexClient")
    this.lru = new LruCache(250)
  }

  async find(params) {
    return [];
  }

  async get(fid, params) {
    const[clazz,id]=fid.split("::")
    let result = this.lru.get(id || clazz)
    if (!result) {
      let art = await this.knex('artikel').where("id", id || clazz)
      if (art.length > 0) {
        const a = art[0]
        result = {
          id: a.id,
          lastupdate: a.lastupdate,
          type: "X",
          BB: "0",
          GTIN: a.EAN,
          PHAR: a.subid,
          DSCR: a.Name,
          ADDDSCR: a.Name_intern,
          ATC: a.ATC_code,
          PEXF: a.ek_preis,
          PPUB: a.vk_preis,
          LieferantID: a.lieferantid,
          Maxbestand: a.maxbestand,
          Minbestand: a.minbestand,
          Istbestand: a.istbestand
        }
      } else {
        art = await this.knex('artikelstamm_ch').where("id", id || clazz)
        if (art.length > 0) {
          result = art[0]
        }
      }
      this.lru.set(id,result)
    }
    return result
  }
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
