const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user').User
const nconf = require('nconf');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const sha = require('crypto-js/sha256')


const serverConf = nconf.get("server")
if (serverConf['googleClientID']) {
  passport.use(new GoogleStrategy({
    clientID: serverConf['googleClientID'],
    clientSecret: serverConf['googleClientSecret'],
    callbackURL: "http://localhost:2017/auth/google/callback"
  }, function (accesstoken, refreshToken, profile, done) {

    User.findOrCreate(profile).then(function (user) {
      if (user) {
        user.token = accesstoken
      }
      return done(null, {token: accesstoken, refresh: refreshToken, user: user})
    }).catch(err => {
      return done(err, null)
    })

    // return done(null, {token: accesstoken, refresh: refreshToken, user: profile})
  }))
}

router.get("/isLoggedIn/:id",function(req,res){
  let guid=User.findLoggedInById(req.param('id'))
  res.json(guid ? {guid:guid} : {})
})

router.get("/user/:guid", function (req, res) {
  let user = User.isLoggedIn(req.param('guid'))
  if (user) {
    res.json(user)
  } else {
    res.json({status: "error", "message": "not logged in."})
  }
})

router.post("/chpwd", function (req, res) {
  let oldpwd = req.param('oldpwd')
  let newpwd = req.param('newpwd')
  let id = req.param('id')

  User.findById(id).then(user => {
    if (user) {
      if(sha(oldpwd) === user['password']){
        user['password']=sha(newpwd)
        user.update()
        res.json({status:"ok"})
      }else{
        res.json({"status":"error","message":"Bad username or password"})
      }
    }else{
      res.json({status:"error",message:"Bad username or password"})
    }
  })

})


router.get("/google", function (req, res, next) {
  let cb=req.query.callback
  res.cookie("webapp",cb, {signed: true})
  next()
}, passport.authenticate('google', {scope: ['profile', 'email']}))

router.get("/google/callback", passport.authenticate('google', {failureRedirect: '/login', session: false}),
  function (req, res) {
    let user = req.user.user
    let guid = user.logIn()
    let webapp=req.signedCookies.webapp
    res.redirect(webapp + "/#/login/" + guid)
  })


module.exports = router;
