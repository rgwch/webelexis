/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { v4 as uuid } from 'uuid'
const { DateTime } = require('luxon')

export class Service {
  private defaults

  constructor(private options = {}) {
    this.defaults = this.options["app"]?.get("fall")
  }

  async find(params) {
    const stickers = this.options["app"].service('stickers')
    const kontakt = this.options["app"].service("kontakt")

    params.query = Object.assign({}, params.query, { istpatient: "1", istperson: "1" })
    const pats = await kontakt.find(params);
    for (const pat of pats.data) {
      const sid = await stickers.find({ query: { forPatient: pat.id } })
      if (sid && sid.length > 0) {
        pat.stickers = sid.map(s => s.name)
      } else {
        pat.stickers = []
      }
    }
    return pats
  }

  async get(id, params) {
    const kontakt = this.options["app"].service("kontakt")
    return kontakt.get(id, params)
  }

  async create(data, params?) {
    const kontakt = this.options["app"].service("kontakt")
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)));
    }
    const faelle = this.options["app"].service("fall")
    const newPatient = Object.assign({}, {
      id: uuid(),
      istpatient: "1",
      istperson: "1",
    }, data)
    if (!newPatient.patientnr || newPatient.patientnr == 0) {
      newPatient.patientnr = await this.nextPatientNr()
    }
    const pat = await kontakt.create(newPatient)
    const fall = await faelle.create({
      "patientid": pat.id,
      "gesetz": (this.defaults["fallgesetz"] || "Privat"),
      "datumvon": DateTime.local().toFormat("yyyyLLdd"),
      "grund": (this.defaults["fallgrund"] || "Krankheit"),
      "garantid": pat.id,
      "kostentrid": pat.id,
      "versnummer": " ",
      "bezeichnung": "auto"
    })
    return pat
  }

  async nextPatientNr() {
    const config = this.options["app"].service("elexis-config")
    try {
      let pnr = await config.get('PatientNummer')
    } catch (err) {
      await config.update("PatientNummer", { wert: "1" })
    }
    const lastPatNr = (parseInt(await config.get('PatientNummer')) + 1).toString()
    config.update('PatientNummer', { wert: lastPatNr })
    return lastPatNr
  }
  async update(id, data, params) {
    if (!data.patientnr || data.patientnr == 0) {
      data.patientnr = await this.nextPatientNr()
    }
    const kontakt = this.options["app"].service("kontakt")
    return kontakt.update(id, data, params)
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    const kontakt = this.options["app"].service("kontakt")
    return kontakt.remove(id);
  }
}

export default function (options) {
  return new Service(options);
};

