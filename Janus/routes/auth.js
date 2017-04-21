const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user').User
const nconf = require('nconf');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

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

      return done(null, {token: accesstoken, refresh: refreshToken, user:user})
    }).catch(err => {return done(err,null)})

    // return done(null, {token: accesstoken, refresh: refreshToken, user: profile})
  }))
}


router.get("/user/:guid", function (req, res) {
  let user = User.isLoggedIn(req.param('guid'))
  if (user) {
    res.json(user)
  } else {
    res.json({status: "error", "message": "not logged in."})
  }
})
router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}))

router.get("/google/callback", passport.authenticate('google', {failureRedirect: '/login', session: false}),
  function (req, res) {
    let user = req.user.user
    let guid = user.logIn()
    let referer = req.get("referer")
    res.redirect(referer + "#/login/" + guid)
  })


module.exports = router;
