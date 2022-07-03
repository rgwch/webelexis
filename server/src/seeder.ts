/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from './logger'

/**
 * In testing-mode, Seeder creates data to initialize the findings-database.
 * In the Elexis-Database a Patient with a TitelSuffix field of "unittest" must
 * exist, otherwise seeder will throw an error.
 */

export default async function (app) {
  // Find patient with TitelSuffix 'unittest' and exit if not found
  const pats = app.service('patient')
  const roles = app.get("roles")

  const testpat = await pats.find({ query: { titelsuffix: "unittest" } })
  if (!testpat || !testpat.data || testpat.data.length < 1) {
    logger.error("No Patient with TitelSuffix 'unittest' found. See src/seeder.js")
    const candidates = await pats.find({ query: { bezeichnung1: { $like: "test%" } } });
    if (candidates && candidates.data.length > 0) {
      const tp = candidates.data[0]
      tp.titelsuffix = "unittest"
      const okay = await pats.update(tp.id, tp)
      logger.info(`chose ${okay.bezeichnung1} ${okay.bezeichnung2} as unittest`)
    } else {
      throw new Error("No Patient with TitelSuffix 'unittest' and none with Name like 'test%' found. See src/seeder.js")
    }
  }
  const pat = testpat.data[0]
  logger.info("found patient 'unittest'")

  // find or create basic document template
  /*
  const templates = app.service('templates')
  try {
    const template = await templates.get("1")
    logger.info("basic template found")
  } catch (err) {
    const fs = require('fs')
    const path = require('path')
    const tmpl = fs.readFileSync(path.join(__dirname, "services/templates/example-template.html"))
    const doc = {
      id: "1",
      "subject": "Brief Demo",
      "dummy": true,
      contents: tmpl.toString()
    }
    const created = await templates.create(doc)
    logger.info("basic template created")

  }
*/
  // create three users: admin, guest, user
  const userService = app.service('user')
  const _guest = {
    id: "guest@webelexis.ch",
    hashed_password: "gast",
    roles: [roles.guest.id],
    is_active: "0"
  }
  const _admin = {
    id: "admin@webelexis.ch",
    hashed_password: "admin",
    roles: [roles.admin.id],
    is_active: "0"
  }
  const _user = {
    id: "user@webelexis.ch",
    hashed_password: "user",
    roles: [roles.user.id, roles.guest.id, roles.doc.id, roles.mpa.id, roles.agenda.id, roles.billing.id],
    is_active: "0"
  }

  for (const e of [_user, _admin, _guest]) {
    try {
      // await userService.remove(e.id)
      await userService.create(e)
      logger.info("dummy user created: " + e.id)
    } catch (err) {
      //      logger.error("could not create user: %s", err)
    }
  }

  const findings = app.service('findings')
  findings.create({
    name: "dummies",
    patientid: pat.id,
    dummy: true,
    creator: "humblebumple",
    elements: ["foo", "bar", "baz"],
    measurements: [
      {
        date: "21.4.1978",
        values: ["17", "28", "34"]
      }, {
        date: "23.6.1982",
        values: ["11", "17", "102"]
      }, {
        date: "30.8.1991",
        values: ["99", "27", "null"]
      }
    ]
  }).then(created => {
    logger.info("created dummy findings")
  }).catch(err => {
    // logger.error("failed creating dummy findings: " + err)
  })


  return true
}
