const express = require('express');
const router = express.Router();
const User = require('../models/user').InternalUser
const nconf = require('nconf');


const serverConf = nconf.get("server")


router.post("/chpwd", function (req, res) {
  let oldpwd = req.query['oldpwd']
  let newpwd = req.query['newpwd']
  let id = req.query['id']

  User.findById(id).then(user => {
    if (user) {
      if (user.checkPassword(oldpwd)) {
        user.setPassword(newpwd)
        res.sendStatus(204)
      } else {
        res.sendStatus(401)
      }
    } else {
      res.sendStatus(401)
    }
  })

})


router.post("/local",function(req,res){
  User.findByMail(req.body.email).then(user => {
    if (user) {
      if (user.checkPassword(req.body.password)) {
        user.sid=user.logIn()
        res.json({"status":"ok",user:user})
      } else {
        res.json({status:"error", message: "Email oder Passwort falsch"})
      }
    } else {
      res.json( {status:"error", message: "Email oder Passwort falsch"})
    }
  }).catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
})

router.get("/logout",function(req,res){
  let sid=req.get("X-sid")
  if(sid){
    let user=User.isLoggedIn(sid)
    if(user){
      user.logOut()
    }
  }
  res.sendStatus(204)
})

router.get("/checksession",function(req,res){
  let sid=req.get("X-sid")
  if(sid) {
    let user=User.isLoggedIn(sid)
    if(user) {
      res.json({"status": "ok"})
    }else{
      res.json({status:"error"})
    }
  }else{
    res.json({"status": "error"})
  }
})


module.exports = router;
