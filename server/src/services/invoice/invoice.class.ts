/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

/* eslint-disable no-unused-vars */
export class Service {
  constructor(private options = {}) { }

  async find(params) {
    return []
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    }
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return data
  }

  async update(id, data, params) {
    return data
  }

  async patch(id, data, params) {
    return data
  }

  async remove(id, params) {
    return { id }
  }
}

export default (options) => new Service(options)
