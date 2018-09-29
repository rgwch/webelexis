/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const authentication = require('./authentication')

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const knex = require('./knex');
const customMethods = require('feathers-custom-methods')

const app = express(feathers());
app.set('public', path.join(__dirname, "../public"))

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers

app.configure(express.rest())
app.configure(socketio());
app.configure(knex);
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication)

// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);
app.configure(customMethods({
  methods: {
    documents: ['toPDF', "store"]
  }
}))

const docs = app.service('documents')
docs.get("1").then(doc => {
  console.log("basic template found")
}).catch(err => {
  const fs = require('fs')
  const path = require('path')
  const tmpl = fs.readFileSync(path.join(__dirname, "services/documents/example-template.html"))
  const doc = {
    id: "1",
    "template": "1",
    "subject": "Brief Demo",
    contents: tmpl.toString()
  }
  docs.create(doc).catch(err=>{
    console.log(err)
  })
})
module.exports = app;
