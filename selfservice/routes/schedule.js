/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const express = require("express")
const router = express.Router()
const { DateTime } = require('luxon')
let sitedef = {
  name: "Praxis Webelexis",
  address: "Hintergasse 58, 9999 Webelexikon",
  phone: "555-555 55 55",
  mail: "invalid@invalid.invalid"
}

router.get("/list/:date?", async (req, res) => {
  try {
    const terminService = req.app.get('terminService')
    const today = req.params.date ? DateTime.fromFormat(req.params.date, "yyyyLLdd") : DateTime.local().set({ hour: 0, minute: 0, second: 0 })
    const resource = await terminService.get("resource")
    sitedef = await terminService.get("site")
    const f1 = await terminService.find({
      query: {
        date: today.toFormat("yyyyLLdd"),
        resource
      }
    })
    const slots = f1.map(slot => {
      const minutes = parseInt(slot.beginn)
      const appnt = today.plus({ minutes })
      return {
        human: appnt.toFormat("HH:mm"),
        id: today.toFormat("yyyyLLdd") + slot.beginn.toString,
        appnt: JSON.stringify(slot)
      }
    })
    const wday = today.weekday
    const tdate = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][wday - 1] + ", " + today.toFormat("dd.LL.yyyy")
    const nextDay = today.plus({ day: 1 }).toFormat("yyyyLLdd")
    const prevDay = today.minus({ day: 1 }).toFormat("yyyyLLdd")
    res.render("termin", {
      title: "Termin",
      slots, tdate, nextDay, prevDay, sitedef
    })
  } catch (err) {
    res.render("error", {
      message: "Interner Fehler", error: err, sitedef
    })
  }
})

router.post("/set", (req, res, next) => {
  const appnt = req.body.appnts
  const email = req.body.email
  const bdate = req.body.bdate
  if (!appnt || !email || !bdate) {
    res.render("baddata", {
      errmsg: "Der Termin kann nur vereinbart werden, wenn Sie alle Felder ausfüllen. Bitte wählen Sie einen Termin aus, und geben Sie Ihre E-Mail Adresse und Ihr Geburtsdatum an.",
      sitedef
    })
  } else {
    const bdate_split = bdate.split(/\s*\.\s*/)
    const bdate_parsed = DateTime.fromObject({ day: parseInt(bdate_split[0]), month: parseInt(bdate_split[1]), year: parseInt(bdate_split[2]) })
    if (bdate_parsed.isValid) {
      req.body.bdate = bdate_parsed.toFormat("yyyyLLdd")
      next()
    } else {
      res.render("baddata", {
        errmsg: 'Das Geburtsdatum konnte nicht interpretiert werden. Bitte geben Sie es in der Form "Tag.Monat.Jahr" ein, wie zum Beispiel "1.4.1970"',
        sitedef
      })
    }

  }
})
router.post("/set", async (req, res) => {
  const appnt = req.body.appnts
  const email = req.body.email
  const dob = req.body.bdate
  const grund = req.body.reason
  const sendmail=req.body.sendmail
  const terminService = req.app.get("terminService")
  try {
    const termin = await terminService.create({ appnt, email, dob, grund, sendmail })
    const dt = DateTime.fromFormat(termin.tag, "yyyyLLdd")
    const human = dt.plus({ "minutes": parseInt(termin.beginn) }).toFormat("dd.LL.yyyy, HH:mm ") + "Uhr"
    res.render("terminok", {
      appnt: termin, human, sitedef
    })
  } catch (err) {
    if (err.message === "PATIENT_NOT_FOUND") {
      res.render("baddata", {
        errmsg: "Es konnte kein Patient mit diesen Daten gefunden werden. Bitte teilen Sie uns ggf. Ihre E-Mail Adresse mit. Selbstverständlich können Sie auch telefonisch einen Termin vereinbaren.",
        sitedef
      })
    } else {
      res.render("baddata", { errmsg: err.message })
    }
  }
})
module.exports = router
