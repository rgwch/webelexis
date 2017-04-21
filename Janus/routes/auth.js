const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user').User


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
    let user = req.user
    let guid = user.logIn()
    let referer = req.get("referer")
    res.redirect(referer + "#/login/" + guid)
  })


module.exports = router;