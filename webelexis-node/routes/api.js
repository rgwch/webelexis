/**
 * Created by gerry on 15.12.15.
 */
var express = require('express');
var router = express.Router();
var nconf=require('nconf')
nconf.argv().env().file('config.json')
var passport=require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({'version':'1.0.0','copyright':'(c) 2015 by G. Weirich'});
});

router.get('/getToken', function(req,res){
  var user=req.query.username
  var pwd=req.query.password
  console.log(user+" "+pwd)
  passport.authenticate('local',{
    successRedirect: '/api/v1',
    failureRedirect: '/'
  })
  res.json({"result":"ok"})
})
module.exports = router;
