const express = require('express');
const router = express.Router();
const User = require('../models/user').InternalUser
const nconf = require('nconf');


const serverConf = nconf.get("server")


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},function (email, password, done) {

}))

router.post("/chpwd", function (req, res) {
  let oldpwd = req.param('oldpwd')
  let newpwd = req.param('newpwd')
  let id = req.param('id')

  User.findById(id).then(user => {
    if (user) {
      if (user.checkPassword(oldpwd)) {
        user.setPassword(newpwd)
        res.json({status: "ok"})
      } else {
        res.json({"status": "error", "message": "Bad username or password"})
      }
    } else {
      res.json({status: "error", message: "Bad username or password"})
    }
  })

})


router.post("/local",function(req,res){
  User.findByMail(req.params.email).then(user => {
    if (user) {
      if (user.checkPassword(req.params.password)) {
        res.json({"status":"ok",user:user.logIn()})
      } else {
        res.json({status:"error", message: "Email oder Passwort falsch"})
      }
    } else {
      res.json( {status:"error", message: "Email oder Passwort falsch"})
    }
  }).catch(err => {
    return
  })
  res.json(req.user)
})

router.get("/logout",function(req,res){
  if(req.logOut) {
    req.logOut()
    res.json({"status": "ok", "message": "logged out"})
  }
})

router.get("/checksession",function(req,res){
  if(req.user){
    res.json(req.user)
  }else{
    res.json({})
  }
})


module.exports = router;
