/* eslint-disable no-unused-vars */


class Service {
  constructor (options) {
    this.options = options || {};
    this.knex=options.Model
  }

  async find (params) {
    if(params.query){
      const pat=params.query.patientId
      return this.knex({it: 'laboritems', rs: 'laborwerte'})
      .select("rs.datum","rs.resultat","it.titel","it.kuerzel")
      .where({
        "rs.patientid":pat,
        "it.id":"rs.itemid"
      })
    }
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
