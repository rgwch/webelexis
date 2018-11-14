/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const logger = require('../../logger')

class Service {
  constructor(options) {
    this.options = options || {};
  }

  async tarmed(kons, law, text) {
    const tarmedService = this.options.app.service('tarmed')
    const query = {
      tx255: {
        $like: "%" + text + "%"
      },
      GueltigVon: { $lte: kons.datum },
      GueltigBis: { $gte: kons.datum },
      ischapter: "0",
      Law: law == "KVG" ? "KVG" : { $ne: "KVG" }
    }
    const result = await tarmedService.find({ query: query })
    return result.data.map(c=>{c.codesystem="tarmed"; return c})
  }

  async article(text) {
    const articleService = this.options.app.service('article')
    const query = {
      DSCR: { $like: text + "%" }
    }
    const result = await articleService.find({ query: query })
    return result.data.map(c => { c.code = c.PHAR; c.codesystem="article"; return c })
  }

  async find(params) {
    if (params && params.query) {
      const searchexpr = params.query.find.replace(/\s+/,"%")
      const enctr = params.query.encounter
      if (!enctr) {
        logger.warn("No Encounter given for billable.find")
        return []
      }
      const caseID = enctr.fallid
      if (!caseID) {
        logger.warn("Encounter %s has no caseID", enctr.fallid)
      }
      const fallService = this.options.app.service('fall')
      const fall = await fallService.get(caseID)
      if (!fall) {
        logger.warn("case not found " + caseID)
      }
      const law = fall.gesetz || fall.extjson.billing || "null"
      let result = []
      switch (law.toLowerCase()) {
        case "kvg":
          result = result.concat(await this.tarmed(enctr, "KVG", searchexpr))
          result = result.concat(await this.article(searchexpr))
          break;
        case "uvg":
        case "iv":
        case "ivg":
        case "mv":
        case "mvg":
          result = result.concat(await this.tarmed(enctr, "UVG", searchexpr))
          result = result.concat(await this.article(searchexpr))
          break;
        case "frei":
        case "privat":
        case "unbekannt":
        case "null":
          result = result.concat(await this.tarmed(enctr, "UVG", searchexpr))
          result = result.concat(await this.article(searchexpr))
          break;
        case "vvg":
          result = result.concat(await this.article(searchexpr))
          break;
      }
      return result
    } else {
      return [];
    }
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
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
