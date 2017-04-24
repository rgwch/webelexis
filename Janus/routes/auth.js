const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user').InternalUser
const nconf = require('nconf');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const LocalStrategy = require('passport-local').Strategy


const serverConf = nconf.get("server")

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},function (email, password, done) {
  User.findByMail(email).then(user => {
    if (user) {
      if (user.checkPassword(password)) {
        done(null, user)
      } else {
        done(null, false, {message: "Email oder Passwort falsch"})
      }
    } else {
      done(null, false, {message: "Email oder Passwort falsch"})
    }
  }).catch(err => {
    return done(err)
  })
}))
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
      return done(null, user)
    }).catch(err => {
      return done(err, null)
    })

    // return done(null, {token: accesstoken, refresh: refreshToken, user: profile})
  }))
}

if (serverConf['twitterApiKey']) {
  passport.use(new TwitterStrategy({
      consumerKey: serverConf['twitterApiKey'],
      consumerSecret: serverConf['twitterApiSecret'],
      callbackURL: "http://localhost:2017/auth/twitter/callback"
    }, function (token, tokenSecret, profile, cb) {
      User.findOrCreate(profile).then(function (user) {
        /*
        if (user) {
          user.token = accesstoken
        }
        */
        return cb(null, user)
      }).catch(err)
      {
        return cb(err, null)
      }
    }
  ))
}

passport.serializeUser(function(user,done){
  done(null,user.logIn())
})

passport.deserializeUser(function(sid,done){
  return User.isLoggedIn(sid)
})

router.get("/isLoggedIn/:id", function (req, res) {
  let sid = User.findLoggedInById(req.param('id'))
  res.json(sid ? {sid: sid} : {})
})

router.get("/user/:sid", function (req, res) {
  let user = User.isLoggedIn(req.param('sid'))
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

router.post("/local",passport.authenticate('local'),function(req,res){
  console.log(req)
  res.json({status:"error"})
})

router.get("/google", function (req, res, next) {
  let cb = req.query.callback
  req.session.webapp=cb
  next()
}, passport.authenticate('google', {scope: ['profile', 'email']}))

router.get("/google/callback", passport.authenticate('google'),
  function (req, res) {
    let guid = req.user.logIn()
    let webapp = req.session.webapp
    res.redirect(webapp + "/#/login/" + guid)
  })

router.get("/twitter", function (req, res, next) {
  let cb = req.query.callback
  req.session.webapp=cb
  next()
}, passport.authenticate('twitter'))


router.get("/twitter/callback", passport.authenticate('twitter'),
  function (req, res) {
    let user = req.user.user
    let guid = user.logIn()
    let webapp = req.session.webapp
    res.redirect(webapp + "/#/login/" + guid)
  }
)


module.exports = router;
