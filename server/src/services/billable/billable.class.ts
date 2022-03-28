/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { logger } from '../../logger'
const tarmed_type = "ch.elexis.data.TarmedLeistung"
const article_type = "ch.artikelstamm.elexis.common.ArtikelstammItem"

export class Service {
  constructor(private options = {}) {
  }

  async tarmed(kons, law, text) {
    const tarmedService = this.options["app"].service('tarmed')
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
    return result.data.map(c => {
      c.uid = c.id
      c.codesystem = tarmed_type;
      c.encounter_id = kons.id;
      c.count = 1;
      return c
    })
  }

  async article(kons, text) {
    const articleService = this.options["app"].service('article')
    const query = {
      DSCR: { $like: text + "%" }
    }
    const result = await articleService.find({ query: query })
    return result.data.map(c => {
      c.uid = c.id
      c.code = c.phar;
      c.codesystem = article_type;
      c.encounter_id = kons.id
      c.count = 1
      return c
    })
  }

  async findMatchingLaw(enctr) {

    const caseID = enctr.fallid
    if (!caseID) {
      logger.warn("Encounter %s has no caseID", enctr.fallid)
    }
    const fallService = this.options["app"].service('fall')
    const fall = await fallService.get(caseID)
    if (!fall) {
      logger.warn("case not found " + caseID)
    }
    const law = fall.gesetz || (fall.extjson ? (fall.extjson.Gesetz || fall.extjson.billing || "KVG") : "KVG")
    return law
  }

  async find(params) {
    if (params && params.query) {
      const searchexpr = params.query.find.replace(/\s+/, "%")
      const enctr = params.query.encounter
      if (!enctr) {
        logger.warn("No Encounter given for billable.find")
        return []
      }
      const law = await this.findMatchingLaw(enctr)
      let result = []
      switch (law.toLowerCase()) {
        case "kvg":
          result = result.concat(await this.tarmed(enctr, "KVG", searchexpr))
          result = result.concat(await this.article(enctr, searchexpr))
          break;
        case "uvg":
        case "iv":
        case "ivg":
        case "mv":
        case "mvg":
          result = result.concat(await this.tarmed(enctr, "UVG", searchexpr))
          result = result.concat(await this.article(enctr, searchexpr))
          break;
        case "frei":
        case "privat":
        case "unbekannt":
        case "null":
          result = result.concat(await this.tarmed(enctr, "UVG", searchexpr))
          result = result.concat(await this.article(enctr, searchexpr))
          break;
        case "vvg":
          result = result.concat(await this.article(enctr, searchexpr))
          break;
        default:
          throw ("Unknown case law in find billables")
      }
      return result
    } else {
      return [];
    }
  }

  decodeService(code) {
    const [codesystem, uid] = code.split("!")
    let service
    let ptyp
    switch (codesystem) {
      case article_type:
      case 'article':
        service = this.options["app"].service('article')
        ptyp = article_type
        break;
      case tarmed_type:
      case 'tarmed':
        service = this.options["app"].service('tarmed')
        ptyp = tarmed_type
        break;
      default:
        ptyp = "unknown"
        throw ("unsupported billable class " + codesystem)
    }
    return [service, uid, ptyp]
  }

  /**
   * Get a service from an id. The ID must be: system!code
   * @param {} id
   * @param {*} params
   */
  async get(id, params) {
    const [service, uid, type] = this.decodeService(id)
    try {
      const billable = await service.get(uid, params)
      billable.codesystem = type
      return billable
    } catch (err) {
      if (err.name == "NotFound") {
        if (type == tarmed_type) {
          const test = await service.find({ query: { code: uid } })
          if (test.data && test.data.length > 0) {
            const billable = test.data[0]
            billable.uid = billable.id
            billable.codesystem = tarmed_type;
            billable.count = 1;
            return billable
          } else {
            throw (err)
          }

        }
      }
    }
  }

  /**
   * Create a Billing from a Billable
   * @param {} data  The billable
   * @param {*} params
   */
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    const billingService = this.options["app"].service('billing')
    /*
    const existing=await billingService.find({query: {behandlung:data.encounter_id}})
    for(const billing of existing.data){
      if(billing.code == data.code && billing.klasse == data.type){
        billing.zahl=(parseInt(billing.zahl)+1).toString
        billingService.patch(billing.id,{zahl: billing.zahl})
        return billing
      }
    }
    */
    delete data.billable.id
    delete data.billable.uid
    const created = await billingService.create(data.billable)
    return created
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    const [service, uid] = this.decodeService(id)
    return await service.remove(uid);
  }
}

export default function (options) {
  return new Service(options);
};

