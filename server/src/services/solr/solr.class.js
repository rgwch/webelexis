/* eslint-disable no-unused-vars */
const request = require('request')
const fs = require('fs')
const getUri = require('get-uri')
const uuid = require('uuid/v4')

class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    if (!data.id) {
      data.id = uuid()
    }
    const url = this.options.host + this.options.core +
     `/update/extract?literal.id=${data.id}&literal.path=${data.contents}&commit=true`

    return new Promise((resolve, reject) => {
      getUri(data.contents, (err, rs) => {
        if (err) {
          reject(err)
        }
        const ropt = {
          uri: url,
          method: 'POST',
          body: rs
        }
        request(ropt, (err, ans) => {
          if (err) {
            reject(err)
          }
          resolve(ans)
        })
      })
    })
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
