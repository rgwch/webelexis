const express = require('express');
const router = express.Router();
const passport = require('passport')
const User =require('../models/user').User


router.get("/google", passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}))

router.get("/google/callback", passport.authenticate('google', {failureRedirect: '/login', session: false}),
  function (req, res) {
    let mongo = require('../services/mongo').MongoDB.getInstance()
    let uid = "google:" + req.user.user.id
    let id = mongo.getUser(uid).then(result => {
      let user=req.user.user
      if (result && result.uid) {
        res.json({status: "ok", "user": user,"token": req.user.token})
      } else {
        let nu = new User(
          {
            uid: "google:"+user.id,
            displayName: user.displayName,
            familyNames: [user.name.familyName],
            givenNames: [user.name.givenName],
            gender: user.gender,
            email: "",
            roles: ["visitor"],
            photos: user.photos
          })
        mongo.writeUser(nu)
        res.json({status: "ok", user: nu, token: req.user.token, message: "created"})
      }
    })
  })


module.exports = router;