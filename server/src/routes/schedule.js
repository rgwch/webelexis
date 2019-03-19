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
      id: today.toFormat("yyyyLLdd") + slot.beginn.toString,
      appnt: JSON.stringify(slot)
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
  const parsed_bdate = DateTime.fromFormat(bdate,"dd.LL.yyyy")
  const dbform = parsed_bdate.toFormat("yyyyLLdd")
  if (!appnt || !email || !bdate) {
    res.render("missingdata")
  } else {
    const app = require('../app')
    const patients = app.service('patient')
    const filtered = await patients.find({ query: { email: email, geburtsdatum: dbform } })
    if (filtered.data.length != 1) {
      res.render("baddata")
    }else{
      const pat=filtered.data[0]
      const termin=JSON.parse(appnt)
      termin.patid=pat.id
      const terminService=app.service('termin')
      const ack=await terminService.create(termin)
    }
  }
})
module.exports = router
