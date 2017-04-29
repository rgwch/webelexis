/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

const express = require('express');
const router = express.Router();
const janus = require('../services/janus')
const url = require('url')
const my = require('../services/mysql')
const mongoService = require('../services/mongo')
const passport = require('passport')
const User = require("../models/user").InternalUser
const nconf = require('nconf')
const auth = new (require('../services/auth')).Authenticator()

const API = "0.1";

const mysql = new my.MySql()
const mongo = new mongoService.MongoDB()
const Janus = new janus.Janus()

const resultType = "application/json+fhir; charset=UTF-8"
const roles = nconf.get('roles') || {}

var mapper = {
  Patient: new (require('../models/patient')).Patient(mysql, mongo),
  Encounter: new (require('../models/encounter')).Encounter(mysql, mongo),
  Flag: new (require('../models/flag')).Flag(mysql, mongo),
  Appointment: new (require('../models/appointment')).Appointment(mysql, mongo),
  Slot: new (require('../models/slot')).Slot(mysql, mongo),
  Schedule: new (require('../models/schedule')).Schedule(mysql, mongo),
  Condition: new (require('../models/condition')).Condition(mysql, mongo),
  MedicationOrder: new (require('../models/medication-order')).MedicationOrder(mysql, mongo)
}


router.get('/', function (req, res, next) {
  res.send('Webelexis FHIR Server v' + require('../app').VERSION + ", API-Level:" + API);
});

router.get('/:datatype/:id', auth.authenticate, function (req, res, next) {
  let type = req.params.datatype
  if (mapper[type]) {
    let hasRole = auth.checkRole(req.user.roles, type, "read")
    if (hasRole) {
      Janus.getAsync(req.params.id, mapper[type]).then(result => {
        res.type(resultType).json(result)
      }).catch(err => {
        sendError(res, err)
      })
    } else {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(422)
  }
})

router.get('/:datatype', auth.authenticate, function (req, resp) {
  var get_params = url.parse(req.url, true).query
  delete(get_params._format)
  resp.set({
    "Content-Type": resultType
  })
  var type = req.params.datatype
  if (type && mapper[type]) {
    if (auth.checkRole(req.user.roles, type, "list")) {
      Janus.queryAsync(get_params, mapper[type], req.url).then(result => {
        "use strict";
        resp.json(result)
      }).catch(error => {
        console.log(error)
        resp.sendStatus(500)
      })
    } else {
      resp.sendStatus(403)
    }
  } else {
    resp.sendStatus(422)
  }

})

router.get("/batch/:id/:start/:number", auth.authenticate, function (req, resp) {
  Janus.getBatch(req.params.id, parseInt(req.params.start), parseInt(req.params.number)).then(result => {
    resp.type(resultType).json(result)
  }).catch(error => {
    console.log(error)
    resp.sendStatus(500)
  })
})

router.put("/:datatype/:id", auth.authenticate, function (req, resp) {
  let fhir = req.body
  var type = req.params.datatype
  if (type && mapper[type]) {
    if (auth.checkRole(req.user.roles, type, "write")) {
      Janus.putAsync(fhir, mapper[type]).then(result => {
        resp.json(fhir)

      }).catch(err => {
        resp.sendStatus(500)
        console.log(err)
      })
    } else {
      resp.sendStatus(403)
    }
  } else {
    resp.sendStatus(422)
  }
})

router.delete("/:datatype/:id", auth.authenticate, function (req, resp) {
  var type = req.params.datatype
  if (type && mapper[type]) {
    if (auth.checkRole(req.user.roles, type, "write")) {
      mapper[type].deleteObject(req.params.id).then(result => {
        resp.json(fhir)
      }).catch(err => {
        resp.sendStatus(500)
        console.log(err)
      })
    } else {
      resp.sendStatus(422)
    }
  }
})

module.exports = router;
