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


  async find(params) {
    const appntService = this.options.app.service('termin')
    const date = params.query.date
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

    const appointments = await appntService.find({ query: { bereich: resource, tag: date } })

    const freeslots = []
    if (appointments && appointments.data) {
      for (const appnt of appointments.data) {
        unavail.push([parseInt(appnt.beginn), parseInt(appnt.beginn) + parseInt(appnt.dauer)])
      }
      const gaps = gapf.findgaps(unavail)
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
