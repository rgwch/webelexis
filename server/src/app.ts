/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
   main entry point for the webelexis server
*/
import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import { logger } from './logger'
// require('iconv-lite').encodingExists('foo')
const authentication = require('./authentication')
import knex from './knex'
const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

import middleware from './middleware'
import services from './services'
import appHooks from './app.hooks'
import channels from './channels'
import admin from './admin'
import seeder from './seeder'
const app = express(feathers())
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

// Load app configuration
app.configure(configuration())

// Enable CORS, security, compression, favicon and body parsing
app.use(cors())
app.use(helmet())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  express.raw({
    inflate: true,
    limit: '50mb',
    type: 'application/octet-stream',
  }),
)
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))

// Host the public folder
app.use('/', express.static(path.join(__dirname, '../../client_v6/dist')))
app.use('/static', express.static(path.join(__dirname, '../public')))

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())
app.configure(knex)

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
app.configure(authentication)
app.configure(admin)

// Set up our services (see `services/index.js`)
app.configure(services)

// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

// Set the application hooks
app.hooks(appHooks)

// If in testing mode: Seed databases
if (app.get('testing')) {
  logger.info('running in testing mode')
  logger.silent=true
  seeder(app).catch((err) => {
    logger.error('reject ' + err)
  })
} else {
  if (process.env.NODE_ENV == "debug") {
    logger.info("running in debug mode")
  } else {
    logger.info('running in production mode')
  }
}
export default app
