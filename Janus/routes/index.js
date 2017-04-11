const express = require('express');
const router = express.Router();
const nconf = require('nconf')
const fs = require('fs')
const moment= require('moment')

/*
 var  x = require('../models/test');

 var Test=new x.Test()
 */
/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('login');
});

router.get('/login', function (req, res) {
  res.render('login', {})
})

router.post('/dologin', function (req, res) {
  "use strict";
  res.json({username: "admin", roles: ["admin", "arzt", "mpa"], token: "abc"})
})

router.get('/configuration', function (req, res, next) {
  try {
    let config = nconf.get('client')
    if (config) {
      res.json(config)
    } else {
      res.json({})
    }
  } catch (err) {
    next(err)
  }
})

router.post('/addContent/:type', function (req, res) {
  let parms = req.body
  let user = parms['user']
  let pwd = parms['pwd']
  let payload = parms['payload']
  let patient=parms['patient']
  let conf=nconf.get('server')
  let dir=conf['documentStore']
  if(!dir){
    dir="."
  }
  if(patient){
    var ps=patient.split(/[ ,]+/)
    var subdir=ps[0]+"_"+ps[1]+"_"+ps[2]
    dir=dir+"/"+subdir
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir)
    }
  }
  switch (req.params['type']) {
    case "image":
      try {
        let buffer = Buffer.from(payload, 'base64')
        let filename="ImageImport-"+moment().format("YYYY-DD-MM_HHmmss")+".jpg"
        let fd = fs.openSync(dir+"/"+filename, "w")
        fs.writeSync(fd, buffer)
        fs.closeSync(fd)
        res.json({"status": "ok"})
      }catch(err){
        res.json({"status":"error","message":err.message})
      }
      break;
    default:
      res.json({status: "error", message: "unknown datatype"})
  }
})
/*
 router.get('/test',function(rq,res){
 res.send(Test.hello())
 })
 */
module.exports = router;
