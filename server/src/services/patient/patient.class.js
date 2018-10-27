/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const uuid = require('uuid/v4')
const { DateTime } = require('luxon')

class Service {

  constructor(options) {
    this.options = options || {};
    this.kontakt = options.app.service("kontakt")
  }

  async find(params) {
    const stickers = this.options.app.service('stickers')
    params.query = Object.assign(params.query, { istpatient: "1", istperson: "1" })
    const pats = await this.kontakt.find(params);
    for (const pat of pats.data) {
      const sid = await stickers.find({ query: { forPatient: pat.id } })
      if (sid && sid.length > 0) {
        pat.stickers = sid.map(s => s.Name)
      } else {
        pat.stickers = []
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
    const faelle = this.options.app.service("fall")
    const newPatient = Object.assign({}, {
      id: uuid(),
      istpatient: "1",
      istperson: "1",
    }, data)
    if (!newPatient.PatientNr || newPatient.PatientNr == 0) {
      newPatient.PatientNr = await this.nextPatientNr()
    }
    const pat = await this.kontakt.create(newPatient)
    const fall = await faelle.create({
      "patientid": pat.id,
      "gesetz": (this.options.app.get("defaults")["fallgesetz"] || "Privat"),
      "datumvon": DateTime.local().toFormat("yyyyLLdd"),
      "grund": (this.options.app.get("defaults")["fallgrund"] || "Krankheit"),
      "garantid": pat.id,
      "kostentrid": pat.id,
      "versnummer": " ",
      "bezeichnung": "auto"
    })
    return pat
  }

  async nextPatientNr() {
    const config = this.options.app.service("elexis-config")
    try {
      let pnr = await config.get('PatientNummer')
    } catch (err) {
      await config.set("PatientNummer", "1")
    }
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
