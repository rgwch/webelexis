const puppeteer = require('pdf-puppeteer')

export class Service {
  constructor(private options = {}) {}

  async find(params) {
    return []
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    }
  }

  /** Generate a PDF from a HTML */
  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }
    return new Promise((resolve, reject) => {
      puppeteer(data.html, (pdf) => {
        resolve(pdf)
      })
    })
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

export default function (options) {
  return new Service(options)
}
