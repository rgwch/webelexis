
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const { Service } = require('feathers-knex');

export class Bills extends Service {
  // private knex
  private app
  constructor(options, app) {
    options.name = 'rechnungen'
    super(options);
    this.app = app
  }

  /**
   * Find existing bills with a given status and optionally for a given patient description
   * patient description can be: "Year of birth" or (part of)"firstname lastname" or (partof)"firstname" or (partof)"lastname"
   * @param params
   * @returns
   */
  async find(params) {
    if (params.query?.patientid) {
      const query = super.knex('faelle')
        .join('rechnungen', 'faelle.id', "=", 'rechnungen.fallid')
        .join('kontakt', 'kontakt.id', '=', 'faelle.patientid')
        .select("rechnungen.*")
      if (params.query.rnstatus) {
        query.where('rechnungen.rnstatus', '=', params.query.rnstatus)
      }
      let q = params.query.patientid
      if (q.match(/[0-9]{4,4}/)) {
        query.where('kontakt.geburtsdatum', 'like', q + "____")
      } else if (q.match(/\w+\s+\w+/)) {
        const vn = q.split(/\s+/)
        query.where('kontakt.bezeichnung1', 'like', vn[0] + "%")
          .andWhere('kontakt.bezeichnung2', 'like', vn[1] + "%")
      } else {
        query.where('kontakt.bezeichnung1', "like", q + "%")
          .orWhere('kontakt.bezeichnung2', "like", q + "%")
      }

      const result = {}
      if (params.query?.$limit) {
        query.limit(params.query.$limit)
        result['limit'] = params.query.$limit
      }
      if (params.query?.$skip) {
        query.offset(params.query.$skip)
        result['skip'] = params.query.$skip
      }
      const raw = query.toString();
      const found = await query
      result['total'] = found.length
      result['data'] = found
      return result
    } else {
      const result = await super.find(params)
      return result
    }
  }
};
