/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const crypto=require('crypto')
const os=require('os')
const fs=require('fs')

module.exports = function (app) {
  const config = app.get('authentication');
  const hasher=crypto.createHash('sha256')
  hasher.update(Math.random().toString())
  hasher.update(os.uptime().toString())
  hasher.update(new Date().toString())
  const load=JSON.stringify(os.loadavg())
  hasher.update(load)
  hasher.update(os.freemem().toString())
  hasher.update(JSON.stringify(os.networkInterfaces()))
  const temp=os.tmpdir()
  hasher.update(temp)
  fs.readdirSync(temp).forEach(f=>{
    hasher.update(f)
  })
  const secret_of_the_day=hasher.digest('hex')

  /* We create a new secret with every launch */
  config.secret=secret_of_the_day

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
