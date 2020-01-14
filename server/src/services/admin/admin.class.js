/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const {hasRight} = require('../../util/acl')

class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  /**
   * Ask if the currently logged-in user has sufficient rights for a given task (as defined in src/services/index.js)
   * @param {string} id can:requeste right, e.g. "can:user.update"
   * @param {any} params
   */
  async get(id, params) {
    if (id.startsWith("can:")) {
      const wants = id.substr(4)
      const can = hasRight(params.user, wants)
      return can
    }
    return {}
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)));
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

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
