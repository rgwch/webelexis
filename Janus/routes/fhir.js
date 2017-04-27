/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

const express = require('express');
const router = express.Router();
const janus = require('../services/janus')
const patientservice = require('../models/patient')
const encounterService = require('../models/encounter')
const url = require('url')
const my = require('../services/mysql')
const mongoService = require('../services/mongo')
const session = require('express-session')
const passport = require('passport')

const API = "0.1";

const mysql = new my.MySql()
const mongo = new mongoService.MongoDB()
const Janus = new janus.Janus()

const resultType = "application/json+fhir; charset=UTF-8"

router.use(session({secret: /*uuid()*/ "something", resave: false, saveUninitialized: true}))
router.use(passport.initialize())
router.use(passport.session())

var mapper = {
  Patient: new patientservice.Patient(mysql, mongo),
  Encounter: new encounterService.Encounter(mysql, mongo),
  Flag: new (require('../models/flag')).Flag(mysql, mongo),
  Appointment: new (require('../models/appointment')).Appointment(mysql, mongo),
  Slot: new (require('../models/slot')).Slot(mysql, mongo),
  Schedule: new (require('../models/schedule')).Schedule(mysql, mongo),
  Condition: new (require('../models/condition')).Condition(mysql,mongo),
  MedicationOrder: new (require('../models/medication-order')).MedicationOrder(mysql,mongo)
}
router.get('/', function (req, res, next) {
  res.send('Webelexis FHIR Server v' + require('../app').VERSION + ", API-Level:" + API);
});

router.get('/:datatype/:id', function (req, res, next){
  var type = req.params.datatype
  if (mapper[type]) {
    Janus.getAsync(req.params.id, mapper[type]).then(result => {
      res.type(resultType).json(result)
    }).catch(err => {
      sendError(res, err)
    })
  } else {
    sendError("unknown data type")
  }
})

router.get('/:datatype', function (req, resp) {
  var get_params = url.parse(req.url, true).query
  delete(get_params._format)
  resp.set({
    "Content-Type": resultType
  })
  var type = req.params.datatype
  if (type && mapper[type]) {
    Janus.queryAsync(get_params, mapper[type], req.url).then(result => {
      "use strict";
      resp.json(result)
    }).catch(error => {
      sendError(resp, error)
    })
  } else {
    sendError(resp, "illegal argument")
  }

})

router.get("/batch/:id/:start/:number", function (req, resp) {
  Janus.getBatch(req.params.id, parseInt(req.params.start), parseInt(req.params.number)).then(result => {
    resp.type(resultType).json(result)
  }).catch(error => {
    sendError(resp, error)
  })
})

router.put("/:datatype/:id",function(req,resp){
  let fhir=req.body
  var type = req.params.datatype
  if (type && mapper[type]) {
    Janus.putAsync(fhir, mapper[type]).then(result=> {
      resp.json(fhir)
    }).catch(err=> {
      sendError(resp, err)
    })
  }else{
    sendError(resp,"illegal argument")
  }
})

router.delete("/:datatype/:id",function(req,resp){
  var type = req.params.datatype
  if (type && mapper[type]) {
    mapper[type].deleteObject(req.params.id).then(result => {
      resp.json(fhir)
    }).catch(err => {
      sendError(resp, err)
    })
  }
})

function sendError(handler, error) {
  handler.json({
    "status": "error",
    "message": error
  })
}
module.exports = router;
