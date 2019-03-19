const express = require("express")
const router = express.Router()
const { DateTime } = require('luxon')
const ElexisUtils = require('../util/elexis-types')
const elexis = new ElexisUtils()


router.get("/list", async (req, res) => {
  const app = require("../app")
  const service = app.service('schedule')
  const today = DateTime.local()
  const f1 = await service.find({
    query: {
      date: today.toFormat("yyyyLLdd"),
      resource: "Arzt"
    }
  })
  const slots = f1.map(slot => {
    return {
      human: elexis.makeTime(slot.beginn),
      id: today.toFormat("yyyyLLdd") + slot.beginn.toString
    }
  })
  res.render("termin", {
    title: "Termin",
    slots, tdate: today.toFormat("dd.LL.yyyy")
  })
})

router.post("/set", async (req, res) => {
  const appnt = req.body.appnts
  const email = req.body.email
  const bdate = req.body.bdate
  if(!appnt || !email || !bdate){
    res.render("missingdata")
  }
})
module.exports = router
