/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-solr');
const { SolrClient } = require('feathers-solr')
const fetch = require('node-fetch')
const solrServer = "http://localhost:8983/solr/"
// const createModel = require('../../models/documents.model');
const hooks = require('./documents.hooks');
const doctool = require('../../util/topdf')
const customMethods = require('feathers-custom-methods')

module.exports = function (app) {
  const Model = fetch;
  const paginate = app.get('paginate');
  const options = Object.assign({},{
    host: solrServer,
    core: "demo",
    Model,
    paginate
  },app.get('solr'));

  // Initialize our service with any options it requires
  app.use('/documents', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('documents');
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
