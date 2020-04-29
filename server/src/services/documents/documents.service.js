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


module.exports = function (app) {
  const solr=app.get('solr')
  const solrServer = solr.host+"/"+solr.core
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
  service.create({ id: "abc", contents: "contents", subject: "test" })/*.then(result => {
    console.log(JSON.stringify(result))
  })*/
  api.checkSchema(app).then(() => {

  }).catch(err => {
    console.log(err)
  })

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
