/* eslint-disable no-unused-vars */

export class Service {
  private knex
  private kService
  constructor(private app, private options: any = {}) {
    this.knex = options['Model']
    this.kService = app.service('kontakt')
  }

  async find(params) {
    if (params.query) {
      const pat = params.query.patientId
      if (pat) {
        const query = this.knex({ rs: 'laborwerte' })
          .join({ li: 'laboritems' }, 'li.id', 'itemid')
          .where({ patientid: pat, visible: '1', 'rs.deleted': '0' })
          .orderBy('datum', 'desc')
          .select([
            'rs.id',
            'rs.datum',
            'rs.Zeit',
            'li.kuerzel',
            'rs.resultat',
            'rs.refmale',
            'rs.reffemale',
            'li.refmann',
            'li.reffrauortx',
            'li.titel',
            'li.kuerzel',
            'li.einheit',
            'rs.unit',
            'gruppe',
            'prio',
          ])

        let limit = params.query.$limit ? params.query.$limit : undefined
        if (this.options.paginate) {
          if (limit) {
            limit = Math.min(limit, this.options.paginate.max)
          } else {
            limit = this.options.paginate.default
          }
        }
        if (limit) {
          query.limit(limit)
        }
        if (params.query.$skip) {
          query.offset(params.query.$skip)
        }
        const found = await Promise.all([
          this.kService.get(pat, { query: { $select: ['geschlecht'] } }),
          query 
        ])
        const s = found[0].geschlecht.toLowerCase()
        const raw = found[1].map((r) => {
          if (s === 'm') {
            r.reference = r.refmale ? r.refmale : r.refmann
          } else {
            r.reference = r.reffemale ? r.reffemale : r.reffrauortx
          }
          delete r.refmale
          delete r.reffemale
          delete r.refmann
          delete r.reffrauortx
          if (!r.unit) {
            r.unit = r.einheit
          }
          delete r.einheit
          return r
        })
        const result = {
          total: found[1].length,
          data: raw,
          skip: 0,
        }
        if (params.query.$skip) {
          result.skip = params.query.$skip
        }
        return result
      }
    }
    return []
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    }
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

export default function (app, options) {
  return new Service(app, options)
}
