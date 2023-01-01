/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DateTime } from 'luxon'
import { ElexisUtils } from '../../util/elexis-types'
import { Gapfinder } from './gapfinder'
import mailmaker from './mailmaker'
const elexis = new ElexisUtils()
const gapf = new Gapfinder()

/* eslint-disable no-unused-vars */
export class Service {
  private defaults
  constructor(private options = { app: undefined }) {
    this.defaults = this.options.app?.get("schedule")

  }


  /**
   * Find free time slots on a given day for a given resource. Some properties are set in config/elexisdefaults:
   *   schedule:{
   *     minDuration: 30,         // minimal duration of a slot to be conisered as free
   *     terminTyp: "Internet",   // type of appointment to create
   *     maxPerDay: 4
   *    }
   * @param {*} params
   */
  async find(params) {
    const appntService = this.options.app.service('termin')
    const date = params.query.date
    const present = DateTime.local().toFormat('yyyyLLdd')
    const resource = params.query.resource
    const minDuration = this.defaults.minDuration
    const dayDefaults = await appntService.get('daydefaults')
    const appntStates = await appntService.get("states")
    const spec = dayDefaults[resource]
    if (!spec) {
      throw new Error("Resource unknown " + resource)
    }
    const day = DateTime.fromFormat(date, 'yyyyLLdd').weekday
    const daystr = ['Mo', 'Di', "Mi", "Do", "Fr", "Sa", "So"][day - 1]
    const unavail = spec[daystr].map(slot => {
      const [from, until] = slot.split(/\s*-\s*/)
      return [elexis.makeMinutes(from), elexis.makeMinutes(until)]
    }) // unavailable times for the given date and resource

    // already existing appointments
    const appointments = await appntService.find({ query: { bereich: resource, tag: date } })

    const freeslots = []
    if (appointments && appointments.data) {
      for (const appnt of appointments.data) {
        unavail.push([parseInt(appnt.beginn), parseInt(appnt.beginn) + parseInt(appnt.dauer)])
      }
      // find gaps but not in the past
      const gaps = gapf.findgaps(unavail).filter(g => {
        if (date < present) {
          return false
        }
        if (date === present) {
          const dt = DateTime.local()
          const now = 60 * dt.get('hour') + dt.get('minute')
          if (now >= g[1]) {
            return false
          }
        }
        return true
      })
      for (const gap of gaps) {
        while (gap[1] - gap[0] >= minDuration) {
          const slot = {
            tag: date,
            beginn: gap[0],
            dauer: minDuration,
            bereich: resource,
            termintyp: this.defaults.terminTyp,
            terminstatus: appntStates[1]
          }
          freeslots.push(slot)
          gap[0] += minDuration
        }
      }
    }
    while (freeslots.length > this.defaults.maxPerDay) {
      const k = Math.round(Math.random() * freeslots.length - 1)
      freeslots.splice(k, 1)
    }
    return freeslots;

  }

  async get(id, params) {
    if (id == "resource") {
      return this.defaults.resource
    } else if (id == "site") {
      return {
        name: this.defaults.sitename,
        address: this.defaults.siteaddr,
        phone: this.defaults.sitephone,
        mail: this.defaults.sitemail
      }
    }
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  /**
   * create a new Appointment
   * @param {appnt: termin, mail: string, dob: string, grund: string} data
   * @param {any} params
   */
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    const appntService = this.options.app.service('termin')
    const patService = this.options.app.service('patient')
    const patients = await patService.find({ query: { email: data.email, geburtsdatum: data.dob } })
    if (patients.data.length < 1) {
      throw (new Error("PATIENT_NOT_FOUND"))
    }
    const termin = JSON.parse(data.appnt)
    termin.patid = patients.data[0].id
    termin.grund = data.grund
    const inserted = await appntService.create(termin)

    if (this.defaults?.confirm && data.sendmail) {
      mailmaker(this.options.app, data)
    }

    return inserted;
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

export default function (options) {
  return new Service(options);
};

