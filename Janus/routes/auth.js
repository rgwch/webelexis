const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user').User


router.get("/user/:guid", function (req, res) {
  let user = User.isLoggedIn(req.param(guid))
  if (user) {
    res.json(user)
  }else{
    res.json({status:"error","message":"not logged in."})
  }
})
router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}))

router.get("/google/callback", passport.authenticate('google', {failureRedirect: '/login', session: false}),
  function (req, res) {
    let mongo = require('../services/mongo').MongoDB.getInstance()
    let uid = "google:" + req.user.user.id
    let id = mongo.getUser(uid).then(result => {
      let user = req.user.user
      let nu
      if (result && result.uid) {
        nu = result
      } else {
        nu = new User({roles: ['visitor']})
      }
      Object.assign(nu, {
        uid: "google:" + user.id,
        displayName: user.displayName,
        familyNames: [user.name.familyName],
        givenNames: [user.name.givenName],
        gender: user.gender,
        email: user.emails[0].value,
        photos: user.photos
      })
      //res.json({status: "ok", user: nu, token: req.user.token, message: "created"})

      mongo.writeUser(nu)
      let guid = nu.logIn()
      let referer = req.get("referer")
      res.redirect(referer + "#/login/" + guid)
    })
  })


module.exports = router;