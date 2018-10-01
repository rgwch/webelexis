/* eslint-disable no-unused-vars */


class Service {
  constructor(app,options) {
    this.options = options || {};
    this.knex = options.Model
    this.app=app
    this.kService=app.service('kontakt')
  }

  async find(params) {
    if (params.query) {
      const pat = params.query.patientId
      if (pat) {
        const found=await Promise.all([this.kService.get(pat,{query: {$select: ['geschlecht']}}),this.knex({ rs: 'laborwerte' }).join({li:'laboritems'}, 'li.id', 'itemid').where({ 'patientid': pat, 'visible': "1", "rs.deleted": "0" })
        .orderBy('datum','desc')
        .select(["rs.datum", "rs.Zeit",
          "li.kuerzel",
          "rs.resultat",
          "rs.refmale", "rs.reffemale",
          "li.RefMann",
          "li.RefFrauOrTx",
          "li.Einheit",
          "rs.unit",
          "gruppe", "prio"]) ])
        const s=found[0].geschlecht.toLowerCase()
        const result= found[1].map(r => {
          if(s==='m'){
          r.reference = r.refmale ? r.refmale : r.RefMann
          }else{
            r.reference = r.reffemale ? r.reffemale : r.RefFrauOrTx
          }
          delete r.refmale
          delete r.reffemale
          delete r.RefMann
          delete r.RefFrauOrTx
          if(!r.unit){
            r.unit=r.Einheit
          }
          delete r.Einheit
          return r
        })
        return {
          total: found[1].length,
          data: result
        }
      }
    }
    return [];
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

module.exports = function (app,options) {
  return new Service(app,options);
};

module.exports.Service = Service;
