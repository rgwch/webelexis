/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const authentication = require("@feathersjs/authentication")
const jwt = require("@feathersjs/authentication-jwt")
const local = require("@feathersjs/authentication-local")
const crypto = require("crypto")
const CustomVerifier = require('./util/user-verifier')
const os = require("os")
const fs = require("fs")
const log = require('./logger')


module.exports = function (app) {
  
  const config = app.get("authentication")
  // In testing mode keep the JWT token valid
  if (app.get("userconfig").testing) {
    config.secret = "not_so_secret"
    config.jwt.expiresIn = "7d"
  } else {
    // in production mode create a new secret with every launch
    // thus invalidating all existing JWT tokens.
    const hasher = crypto.createHash("sha256")
    hasher.update(Math.random().toString())
    hasher.update(os.uptime().toString())
    hasher.update(new Date().toString())
    hasher.update(os.freemem().toString())
    const secret_of_the_day =
      hasher.digest("hex") + crypto.randomBytes(64).toString("hex")

    config.secret = secret_of_the_day
  }
 
  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt())
  app.configure(local({ Verifier: CustomVerifier }))

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service("authentication").hooks({
    before: {
      create: [authentication.hooks.authenticate(config.strategies)],
      remove: [authentication.hooks.authenticate("jwt")]
    }
  })
}
