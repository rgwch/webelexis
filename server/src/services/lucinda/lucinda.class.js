const fetch = require('node-fetch')
const fs = require('fs')
const getUri = require('get-uri')
const uuid = require('uuid/v4')

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  /**
   * find matching documents.
   * @param {} params - query: A lucene-style query string
   */
  async find(params) {
    delete params.query.deleted
    const options = {
      method: "POST",
      body: JSON.stringify(params.query),
      headers: { "Content-Type": "application/json" }
    }
    const res = await fetch(this.options.url + "query", options)
    if (res.status == 204) {
      return ([])
    } else if (res.status == 200) {
      return await res.json()
    } else {
      throw new Error("bad result")
    }

  }

  /**
   * Load a document by id
   * Returns: The binary contents of the document
   * @param {} id
   * @param {*} params
   */
  async get(id, params) {
    if (id == "info") {
      const res = await fetch(this.options.url)
      return await res.text()
    } else {
      const res = await fetch(this.options.url + "get/" + id)
      if (res.status == 200) {
        return await res.text()
      }
      else {
        return ""
      }
    }
  }

  /**
   * Add a new document to the index
   * @param {} data
   * {
   *  payload: base64-encoded binary content of the document
   *  filename: If given, store the document. Otherwise index only
   *  concern: If given, subfolder to store (e.g. patient name)
   *  any_attribute: "any value" - arbitrary user defined metadata
   * }
   * @param {*} params
   * @returns: a result with statusCode (201 for ok), a status with "ok" and the _id.
   */
  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    return new Promise((resolve, reject) => {
      const endpoint = data.filename ? "addfile" : "index"
      request({
        method: "POST",
        uri: this.options.url + endpoint,
        body: data,
        json: true
      }, (err, result) => {
        if (err) {
          reject(err)
        }
        if (result) {
          resolve(result)
        }
      })
    })

  }

  /**
   * Update (i.e. reindex) an existing document. Only metadata are updated, not the document itself
   * @param {*} id: id of the document to reindex
   * @param {*} data @see create
   * @param {*} params
   */
  update(id, data, params) {
    return new Promise((resolve, reject) => {
      request({
        method: "POST",
        uri: this.options.url + "update",
        body: data,
        json: true
      }, (err, result) => {
        if (err) reject(err)
        if (result) {
          if (result.statusCode == 202) {
            return result.body
          } else {
            reject("error " + result.statusCode.toString())
          }
        }
      })
    })

  }

  async patch(id, data, params) {
    return await this.update(id, data, params);
  }

  remove(id, params) {
    return new Promise((resolve, reject) => {
      request.get(this.options.url + "remove/" + id, (err, res) => {
        if (err) reject(err)
        if (res) {
          if (res.statusCode == 200) {
            if (typeof (res.body) == 'string') {
              resolve(JSON.parse(res.body))
            } else {
              resolve(res.body)
            }
          }
        }
      })
    })
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
