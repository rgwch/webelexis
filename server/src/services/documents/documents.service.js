/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const Service = require('feathers-solr');
const { SolrClient } = require('feathers-solr');
const fetch = require('node-fetch')
const api = require('./solr')
// const createModel = require('../../models/documents.model');
const hooks = require('./documents.hooks');
const doctool = require('../../util/topdf')
const customMethods = require('feathers-custom-methods')
const log = require('../../logger')
const watcher = require('chokidar')
const fs = require('fs')
const walker = require('walkdir')


module.exports = async function (app) {
  const solr = app.get('solr')
  const solrServer = solr.host + "/" + solr.core
  const paginate = app.get('paginate');
  const options = {
    Model: SolrClient(fetch, solrServer),
    multi: true,
    // events: ['testing'],
    // paginate: {default:10, max:100}
  }

  // Initialize our service with any options it requires
  app.use('/documents', new Service(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('documents');
  // service.create({ id: "abc", contents: "contents", subject: "test" })/*.then(result => {
  // console.log(JSON.stringify(result))
  // })*/
  await api.checkSchema(app)

  const storeRescan = async (base) => {
    const emitter = walker(base)
    emitter.on('file', async (filename, stat) => {
      try {
        const exist = await service.get(api.makeFileID(app, filename))
        log.debug(exist.id)
      } catch (ex) {
        const created = await service.create({ contents: filename }, { inPlace: true })
        log.debug(created.id)
      }
    })
    emitter.on('end', () => {
      return true
    })
    emitter.on('error', () => {
      throw new Error("can't read path " + base)
    })
    emitter.on('fail', p => {
      log.warn("failed on " + p)
    })

  }


  if (solr.watch) {
    let storage = api.getStorage(app)
    storeRescan(storage).then(() => {
      watcher.watch(storage, {
        ignored: /(^|[\/\\])\../,
        followSymlinks: false
      })
        .on('add', async fp => {
          try {
            await service.create({ contents: "file://" + fp }, { inPlace: true })
            log.info("added " + fp)
          } catch (err) {
            log.error("Error adding " + fp + ", " + err)
          }
        })
        .on('change', async fp => {
          try {
            await service.update({ contents: "file://" + fp })
          } catch (err) {
            log.error("Error updating " + fp + ", " + err)
          }
        })
        .on('unlink', async fp => {
          try {
            await service.remove(api.makeFileID(app, fp))
          } catch (err) {
            log.error("Error removing " + fp + ", " + err)
          }
        })
        .on('error', err => { })
    })

  }

  /*
  app.configure(customMethods({
    methods: {
      documents: ['toPDF', "store"]
    }
  }))

  service.toPDF=doctool.toPDF
*/
  service.hooks(hooks);
};
