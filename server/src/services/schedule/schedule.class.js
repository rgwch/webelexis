const defaults = require('../../../config/elexisdefaults').schedule

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const appntService = this.options.app.service('termin')
    const date = params.query.date
    const resource = params.query.resource
    const minDuration = 30
    const appointments = await appntService.find({ query: { bereich: resource, tag: date } })
    if (appointments && appointments.data && appointments.data.length) {
      let prev = appointments.data[0]
      const freeSlots = []
      for (let i = 0; i < appointments.data.length - 1; i++) {
        let appnt = appointments.data[i]
        const following = appointments.data[i + 1]
        while (following.beginn - appnt.beginn - appnt.dauer >= minDuration) {
          const slot = {
            beginn: appnt.beginn + appnt.dauer.beginn,
            dauer: minDuration,
            tag: appnt.tag,
            bereich: resource
          }
          freeSlots.push(slot)
          appnt = slot
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
    const appntService=this.options.app.service
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
