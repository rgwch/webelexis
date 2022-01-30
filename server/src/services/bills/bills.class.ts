
const { Service } = require('feathers-knex');

export class Bills extends Service {
  private knex
  private app
  constructor(options, app) {
    options.name = 'rechnungen'
    super(options);
    this.app = app
  }

  async find(params) {
    if (params.query?.patientid) {
      const query = this.knex('faelle')
        .join('rechnungen', 'faelle.id', "=", 'rechnungen.fallid')
        .where('faelle.patientid', params.query.patientid)
        .select("rechnungen.*")
      const result = await query
      return {
        total: result.length,
        data: result
      }
    } else {
      return super.find(params)
    }
  }
};
