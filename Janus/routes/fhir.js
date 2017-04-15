/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

var express = require('express');
var router = express.Router();
var janus = require('../services/janus')
var patientservice = require('../models/patient')
var encounterService = require('../models/encounter')
var url = require('url')
var my = require('../services/mysql')
var mongoService = require('../services/mongo')
var API = "0.1";

var mysql = new my.MySql()
var mongo = new mongoService.MongoDB()
var Janus = new janus.Janus()

const resultType = "application/json+fhir; charset=UTF-8"

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
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Webelexis FHIR Server v' + require('../app').VERSION + ", API-Level:" + API);
});

router.get('/:datatype/:id', function (req, res, next) {
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
