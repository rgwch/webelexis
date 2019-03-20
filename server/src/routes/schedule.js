const express = require("express")
const router = express.Router()
const { DateTime } = require('luxon')
const ElexisUtils = require('../util/elexis-types')
const elexis = new ElexisUtils()


router.get("/list/:date?", async (req, res) => {
  const app = require("../app")
  const service = app.service('schedule')
  const today = req.params.date ? DateTime.fromFormat(req.params.date,"yyyyLLdd") : DateTime.local()
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
  const wday=today.weekday
  const tdate=["Mo","Di","Mi","Do","Fr","Sa","So"][wday-1]+", "+today.toFormat("dd.LL.yyyy")
  const nextDay=today.plus({day:1}).toFormat("yyyyLLdd")
  const prevDay=today.minus({day:1}).toFormat("yyyyLLdd")
  res.render("termin", {
    title: "Termin",
    slots, tdate, nextDay, prevDay
  })
})

router.post("/set", (req, res, next) => {
  const appnt = req.body.appnts
  const email = req.body.email
  const bdate = req.body.bdate
  if (!appnt || !email || !bdate) {
    res.render("baddata", { errmsg: "Der Termin kann nur vereinbart werden, wenn Sie alle Felder ausfüllen. Bitte wählen Sie einen Termin aus, und geben Sie Ihre E-Mail Adresse und Ihr Geburtsdatum an." })
  } else {
    const bdate_split = bdate.split(/\s*\.\s*/)
    const bdate_parsed = DateTime.fromObject({ day: parseInt(bdate_split[0]), month: parseInt(bdate_split[1]), year: parseInt(bdate_split[2])})
    if (bdate_parsed.isValid) {
      req.body.bdate=bdate_parsed.toFormat("yyyyLLdd")
      next()
    } else {
      res.render("baddata", { errmsg: 'Das Geburtsdatum konnte nicht interpretiert werden. Bitte geben Sie es in der Form "Tag.Monat.Jahr" ein, wie zum Beispiel "1.4.1970"' })
    }

  }
})
router.post("/set", async (req, res) => {
  const appnt = req.body.appnts
  const email = req.body.email
  const app = require('../app')
  const patients = app.service('patient')
  const filtered = await patients.find({ query: { email: email, geburtsdatum: req.body.bdate} })
  if (filtered.data.length != 1) {
    res.render("baddata", {
      errmsg: "Es konnte kein Patient mit diesen Daten gefunden werden. Bitte teilen Sie uns ggf. Ihre E-Mail Adresse mit. Selbstverständlich können Sie auch telefonisch einen Termin vereinbaren."
    })
  } else {
    const pat = filtered.data[0]
    const termin = JSON.parse(appnt)
    termin.patid = pat.id
    const terminService = app.service('termin')
    const ack = await terminService.create(termin)
    const human=DateTime.fromFormat(termin.tag,"yyyyLLdd").toFormat("dd.LL.yyyy")+", "+elexis.makeTime(parseInt(termin.beginn))+" Uhr"
    res.render("terminok",{appnt: ack, human })
  }
})
module.exports = router
