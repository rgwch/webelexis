const tmp = require('tmp')
const unzip = require('extract-zip')
const xmlstream = require('xml-stream')
const fs = require('fs')
const path = require('path')
const logger = require('../logger')


class Oddb {

  constructor(app) {
    this.app = app
    const tmpobj = tmp.dirSync()
    tmp.setGracefulCleanup()
    this.tmpdir = tmpobj.name
    this.db = app.service('article')
  }

  importFromZip(filepath) {
    return new Promise((resolve, reject) => {
      unzip(filepath, { dir: this.tmpdir }, err => {
        if (err) {
          reject(err)
        }
        const input = fs.createReadStream(path.join(this.tmpdir, "/oddb_article.xml"))
        const xml = new xmlstream(input)
        const itemPromises = []
        xml.preserve("ART")
        xml.collect("ARTPRI")
        xml.on('end', async () => {
          const results = await Promise.all(itemPromises)
          for (const result of results) {
            const elem = await this.createOrUpdate(result)
            logger.info("processed "+elem)
          }
          resolve()
        })
        xml.on('endElement:ART', async item => {
          try {
            itemPromises.push(this.checkItem(item))
          } catch (err) {
            logger.error(err)
          }
        })
      })
    })
  }

  createOrUpdate(existing) {
    if (existing.data.length == 0) {
      return this.db.create(imp)
    } else {
      return this.db.patch(existing.data[0].id, imp)
    }
  }


  checkItem(item) {
    const imp = {
      BB: "0",
      PHAR: item.PHAR.$text,
      DSCR: item.DSCRD.$text,
      ADDDSCR: item.SORTD.$text,
      NARCOTIC: (item.BG.$text == "Y") ? "1" : "0"
    }
    if (item.ARTBAR && item.ARTBAR.BC) {
      imp.GTIN = item.ARTBAR.BC.$text
    }
    if (item.ARTPRI) {
      if (Array.isArray(item.ARTPRI)) {
        for (const pri of item.ARTPRI) {
          if (pri.PTYP.$text == "ZURROSE") {
            imp.PEXF = pri.PRICE.$text
          } else if (pri.PTYP.$text == "ZURROSEPUB") {
            imp.PPUB = pri.PRICE.$text
          }
        }
      } else {
        logger.warn("ARTPRI: " + item.ARTPRI)
      }
    }
    const query = {
      PHAR: imp.PHAR
    }
    if (imp.gtin) {
      query.GTIN = imp.GTIN
    }
    return this.db.find({ query: query })

  }
}
module.exports = Oddb
