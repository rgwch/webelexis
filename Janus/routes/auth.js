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
  let oldpwd = req.query['oldpwd']
  let newpwd = req.query['newpwd']
  let id = req.query['id']

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
        user.sid=user.login()
        res.json({"status":"ok",user:user})
      } else {
        res.json({status:"error", message: "Email oder Passwort falsch"})
      }
    } else {
      res.json( {status:"error", message: "Email oder Passwort falsch"})
    }
  }).catch(err => {
    console.log(err)
    res.send(500)
  })
})

router.get("/logout",function(req,res){

})

router.get("/checksession",function(req,res){
  if(req.user){
    res.json(req.user)
  }else{
    res.json({})
  }
})


module.exports = router;
