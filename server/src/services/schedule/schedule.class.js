const defaults = require('../../../config/elexisdefaults').schedule
const { DateTime } = require('luxon')
const ElexisUtils = require('../../util/elexis-types')
const elexis = new ElexisUtils()

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  overlaps(per, slots) {
    for (const slot of slots) {
      if (per[0] !== slot[0] || per[1] !== slot[1]) {
        if (per[0] > slot[0] && per[0] < slot[1]) {
          return true
        }
        if (per[1] > slot[0] && per[1] < slot[1]) {
          return true
        }
      }
    }
    return false
  }
  async find(params) {
    const appntService = this.options.app.service('termin')
    const date = params.query.date
    const resource = params.query.resource
    const minDuration = defaults.minDuration
    const dayDefaults = await appntService.get('daydefaults')
    const spec = dayDefaults[resource]
    const day = DateTime.fromFormat(date, 'yyyyLLdd').weekday
    const daystr = ['Mo', 'Di', "Mi", "Do", "Fr", "Sa", "So"][day - 1]
    const unavail = spec[daystr].map(slot => {
      const [from, until] = slot.split(/\s*-\s*/)
      return [elexis.makeMinutes(from), elexis.makeMinutes(until)]
    }) // unavailable times for the given date and resource

    const appointments = await appntService.find({ query: { bereich: resource, tag: date } })

    if (appointments && appointments.data) {
      for (const appnt of appointments.data) {
        unavail.push([parseInt(appnt.beginn), parseInt(appnt.beginn) + parseInt(appnt.dauer)])
      }
      const freeSlots = []

      while(unavail.length>0) {
        const cand=unavail.shift()
        const slot = {
          beginn: cand[0] + cand[1],
          dauer: minDuration,
          bereich: resource
        }
        if (slot.beginn < 24 * 60 && !this.overlaps([slot.beginn, slot.beginn + minDuration], unavail)) {
          freeSlots.push(slot)
          unavail.push([slot.beginn,slot.beginn+slot.dauer])
        }
      }
      return freeSlots;
    } else {
      return []
    }
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
    const appntService = this.options.app.service
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

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
