/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
   main entry point for the webelexis server
*/
import { logger } from '../logger'
const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

import { config as userconf } from './configuration'
const app = express(feathers())

// Load app configuration
app.configure(configuration())
try {
  app.set(
    'userconfig',
    /* require(process.env.WEBELEXIS_SETTINGS) || */ userconf,
  )
} catch (err) {
  app.set('userconfig', {})
}

// Enable CORS, security, compression, favicon and body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  express.raw({
    inflate: true,
    limit: '50mb',
    type: 'application/octet-stream',
  }),
)


// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())




// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))



export default app
