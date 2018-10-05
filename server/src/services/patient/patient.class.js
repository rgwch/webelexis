/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const uuid = require('uuid/v4')

class Service {

  constructor(options) {
    this.options = options || {};
    this.kontakt = options.app.service("kontakt")
  }

  async find(params) {
    const stickers = this.options.app.service('stickers')
    params.query = Object.assign(params.query, { istPatient: "1", istPerson: "1" })
    const pats = await this.kontakt.find(params);
    for(const pat of pats.data){
      const sid=await stickers.find({query:{forPatient: pat.id}})
      if(sid && sid.length>0){
        pat.stickers=sid.map(s=>s.Name)
      }else{
        pat.stickers=[]
      }
    }
    return pats
  }

  async get(id, params) {
    return this.kontakt.get(id, params)
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)));
    }
    const newPatient = Object.assign({}, {
      id: uuid(),
      istPatient: "1",
      istPerson: "1",
    }, data)
    if (!newPatient.PatientNr || newPatient.PatientNr == 0) {
      newPatient.PatientNr = await this.nextPatientNr()
    }
    return this.kontakt.create(newPatient)
  }

  async nextPatientNr() {
    const config = this.options.app.service("elexis-config")
    const lastPatNr = (parseInt(await config.get('PatientNummer')) + 1).toString()
    config.update('PatientNummer', { wert: lastPatNr })
    return lastPatNr
  }
  async update(id, data, params) {
    if (!data.PatientNr || data.PatientNr == 0) {
      data.PatientNr = await this.nextPatientNr()
    }
    //data.lastupdate=new Date().getTime()
    return this.kontakt.update(id, data, params)
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return this.kontakt.remove(id);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
