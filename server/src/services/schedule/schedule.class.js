/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const defaults = require('../../../config/elexisdefaults').schedule
const { DateTime } = require('luxon')
const ElexisUtils = require('../../util/elexis-types')
const GapFinder = require('./gapfinder')
const elexis = new ElexisUtils()
const gapf = new GapFinder()

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
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
    const present=DateTime.local().toFormat('yyyyLLdd')
    const resource = params.query.resource
    const minDuration = defaults.minDuration
    const dayDefaults = await appntService.get('daydefaults')
    const appntStates = await appntService.get("states")
    const spec = dayDefaults[resource]
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
      const gaps = gapf.findgaps(unavail).filter(g=>{
        if(date<present){
          return false
        }
        if(date===present){
          const now=DateTime.local().get('minutes')
          if(now<=gaps[1]){
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
            termintyp: defaults.terminTyp,
            terminstatus: appntStates[1]
          }
          freeslots.push(slot)
          gap[0]+=minDuration
        }
      }
    }
    while(freeslots.length>defaults.maxPerDay){
      const k=Math.round(Math.random()*freeslots.length-1)
      freeslots.splice(k,1)
    }
    return freeslots;

  }

  async get(id, params) {
    if(id=="resource"){
      return defaults.resource
    }
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  /**
   * create a new Appointment
   * @param {appnt: termin, mail: string, dob: string} data
   * @param {any} params
   */
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    const appntService = this.options.app.service('termin')
    const patService=this.options.app.service('patient')
    const patients=await patService.find({query:{email: data.email,geburtsdatum: data.dob}})
    if(patients.data.length<1){
      throw(new Error("PATIENT_NOT_FOUND"))
    }
    const termin=JSON.parse(data.appnt)
    termin.patid=patients.data[0].id
    const inserted=await appntService.create(termin)
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

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
