/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
   main entry point for the webelexis server
*/
const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const authentication = require('./authentication')
const knex = require('./knex');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const admin = require('./admin')
const terminRouter = require('./routes/schedule')
const http = require('http')

/**
 * create dummy server for self-service
 */
http.createServer((req,res)=>{
  const host=req.headers.host.split(":")
  const port=process.env.EXTERNAL_PORT || 3030
  const newloc=`http://${host[0]}:${port}/termin/list`
  console.log("redirecting to "+newloc)
  res.writeHead(302,{Location: newloc})
  res.end()
}).listen(4040)

const app = express(feathers());
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')


// Load app configuration
app.configure(configuration());
app.set("userconfig", require('../../data/settings'))

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', express.static(app.get('public')));
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use("/termin", terminRouter)

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio());
app.configure(knex);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication)
app.configure(admin)

// Set up our services (see `services/index.js`)
app.configure(services);

// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

// Set the application hooks
app.hooks(appHooks);

// If in testing mode: Seed databases
if (app.get("userconfig").testing) {
  logger.info("running in testing mode")
  const seeder = require('./seeder')
  seeder(app).catch(err => { console.log("reject " + err) })
} else {
  logger.info("running in production mode")
}
module.exports = app;
