import fetch from 'node-fetch'
// import fs from 'fs'
const getUri = require('get-uri')
import { v4 as uuid } from 'uuid'

/* eslint-disable no-unused-vars */
export class Service {
  constructor(private options = { url: "" }) {
  }

  /**
   * find matching documents.
   * @param {} params - query: A lucene-style query string
   */
  async find(params) {
    // delete params.deleted
    let q = params.query
    if (typeof (params.query) == 'object') {
      q = ""
      for (const attr in params.query) {
        if (attr !== "deleted") {
          q += attr + ":" + params.query[attr] + ","
        }
      }
    }
    const options = {
      method: "POST",
      body: JSON.stringify({ query: q, limit: 100 }),       // TODO: paginate
      headers: { "Content-Type": "application/json" }
    }
    const res = await fetch(this.options.url + "query", options)
    if (res.status == 204) {
      return ({ total: 0, data: [], skip: 0, limit: 100 })
    } else if (res.status == 200) {
      const found = await res.json()
      return { total: found['numFound'], data: found['docs'], skip: found['start'] }
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
        return await res.buffer()
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
   * @returns: a result with statusCode (201/202 for ok), a status with "ok" and the _id.
   */
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    const endpoint = data && data.filename ? "addfile" : "addindex"
    const payload = data.payload
    delete data.payload
    const subdir = (data.concern as string).substring(0, 1).toLocaleLowerCase()
    data.filepath = subdir + "/" + data.concern + "/" + data.filename
    const options = {
      method: "POST",
      body: JSON.stringify({ metadata: data, payload }),
      headers: { "Content-Type": "application/json" }
    }
    const result = await fetch(this.options["url"] + endpoint, options)
    if (result.status == 201) {
      return "indexed"
    } else if (result.status == 202) {
      return "added"
    } else {
      throw new Error("bad request " + result.statusText)
    }

  }

  /**
   * Update (i.e. reindex) an existing document. Only metadata are updated, not the document itself
   * @param {*} id: id of the document to reindex
   * @param {*} data @see create
   * @param {*} params
   */
  async update(id, data, params) {
    const opt = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }
    const result = await fetch(this.options.url + "update", opt)
    if (result.status == 200) {
      return await result.json()
    } else {
      throw new Error(result.statusText)
    }

  }

  async patch(id, data, params) {
    return await this.update(id, data, params);
  }

  /**
   * remove a document from the database and the filestore
   * @param {string} id the id of the document
   */
  async remove(id, params) {
    const result = await fetch(this.options.url + "removeindex/" + id)
    if (result.status == 200) {
      const ret = await result.text()
      return "ok"
    } else {
      throw new Error("Could not delete " + id)
    }

  }
}

export default function (options) {
  return new Service(options);
};

