const express = require('express');
const router = express.Router();
const nconf = require('nconf')
const fs = require('fs')

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
  switch (req.params['type']) {
    case "image":
      let buffer = Buffer.from(payload, 'base64')
      let fd = fs.openSync("/home/gerry/testimage.jpg", "w")
      fs.writeSync(fd, buffer)
      fs.closeSync(fd)
      res.json({"status": "ok"})
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
