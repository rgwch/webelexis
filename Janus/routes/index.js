var express = require('express');
var router = express.Router();
var nconf=require('nconf')

/*
var  x = require('../models/test');

var Test=new x.Test()
 */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('login');
});

router.get('/login', function (req, res) {
  res.render('login', {})
})

router.post('/dologin', function (req, res) {
  "use strict";
  res.json({username:"admin",roles:["admin","arzt","mpa"],token:"abc"})
})

router.get('/configuration', function (req, res, next) {
  try {
    let config=nconf.get('client')
    if(config) {
      res.json(config)
    }else{
      res.json({})
    }
  } catch (err) {
    next(err)
  }
})
/*
router.get('/test',function(rq,res){
  res.send(Test.hello())
})
 */
module.exports = router;
