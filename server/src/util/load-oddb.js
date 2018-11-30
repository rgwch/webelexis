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

  checkArticleEntry(item) {
    return new Promise(async (resolve, reject) => {
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
      const existing = await this.db.find({ query: query })
      setTimeout(async () => {
        if (existing.data.length == 0) {
          resolve(await this.db.create(imp))
        } else {
          resolve(await this.db.patch(existing.data[0].id, imp))
        }
      }, 10)
    })
  }

  checkProductEntry(prod) {
    const imp = {
      GTIN: prod.GTIN.$text,
      PRODNO: prod.PRODNO.$text,
      ATC: prod.ATC.$text,
      PKG_SIZE: prod.PackGrSwissmedic.$text,
      SUBSTANCE: prod.SubstanceSwissmedic.$text
    }
    return this.db.find({ query: { GTIN: imp.GTIN } }).then(async result => {
      if (result.data.length == 0) {
        return await this.db.create(result.data[0])
      } else {
        return await this.db.patch(result.data[0].id, imp)
      }
    })
  }
  importFromZip(filepath) {
    return new Promise((resolve, reject) => {
      unzip(filepath, { dir: this.tmpdir }, err => {
        if (err) {
          reject(err)
        }
        this.importArticles().then(result => {
          return result
        }).then(result => {
          if (result) {
            this.importProducts().then(result => {
              if (result) {
                resolve()
              } else {
                reject()
              }

            })
          } else {
            reject()
          }
        })
      })
    })
  }

  importProducts() {
    return new Promise((resolve, reject) => {
      const input = fs.createReadStream(path.join(this.tmpdir, "/oddb_product.xml"))
      const xml = new xmlstream(input)
      let counter = 0;
      xml.preserve("PRD")
      xml.on("end", () => {
        resolve(true)
      })
      xml.on("endElement:PRD", async item => {
        try {
          xml.pause()
          const prod = await this.checkProductEntry(item)
          // logger.info(JSON.stringify(prod))
          counter += 1
          if (Math.round(counter / 100) == counter / 100) {
            logger.info(counter)
          }
          xml.resume()
        } catch (err) {
          reject(err)
        }
      })
    })
  }
  importArticles() {
    return new Promise((resolve, reject) => {
      const input = fs.createReadStream(path.join(this.tmpdir, "/oddb_article.xml"))
      const xml = new xmlstream(input)
      let counter = 0
      xml.preserve("ART")
      xml.collect("ARTPRI")
      xml.on('end', () => {
        resolve(true)
      })
      xml.on('endElement:ART', async item => {
        try {
          xml.pause()
          const art = await this.checkArticleEntry(item)
          counter += 1
          if (Math.round(counter / 100) == counter / 100) {
            logger.info(counter)
          }

          //logger.info("Article "+art.DSCR)
          xml.resume()
        } catch (err) {
          logger.error(err)
          reject(err)
        }
      })
    })
  }
}

module.exports = Oddb
