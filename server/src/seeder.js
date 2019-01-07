/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const logger = require('./logger')
const roles = require('../config/roles')

/**
 * In testing-mode, Seeder creates data to initialize the NeDB-databases.
 * In the Elexis-Database a Patient with a last name of "unittest" must
 * exist, otherwise seeder will throw an error.
 */

module.exports = async function (app) {
  // Find patient with name 'unittest' and exit if not found
  const pats = app.service('patient')
  //const allpats= await pats.find({query:{Bezeichnung2: {$like: "ar%"}}})
  const testpat = await pats.find({ query: { Bezeichnung1: "unittest" } })
  if (!testpat || !testpat.data || testpat.data.length < 1) {
    logger.error("No Patient with name 'unittest' found. See src/seeder.js")
    throw new Error("No Patient with name 'unittest' found. See src/seeder.js")
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
  const usr = app.service('usr')
  const guest = {
    email: "guest@some.where",
    label: "jemand",
    password: "gast",
    roles: [roles.guest],
    dummy: true
  }
  const admin = {
    email: "admin@webelexis.ch",
    label: "admin",
    password: "admin",
    roles: [roles.admin],
    dummy: true
  }
  const user = {
    email: "user@webelexis.ch",
    label: "Gerry",
    password: "user",
    roles: [roles.user, roles.guest, roles.doc, roles.mpa, roles.agenda, roles.billing],
    dummy: true
  }
  usr.remove(null, { query: { dummy: true } }).then(removed => {
    Promise.all([usr.create(guest), usr.create(admin), usr.create(user)]).then(result => {
      logger.info("created dummy users")
    }).catch(err => {
      logger.error("could not create user: %s", err)
    })
  })

  const macro = app.service('macros')
  macro.remove(null, { query: { dummy: true } }).then(removed => {
    macro.create({
      name: "dummies",
      creator: "humblebumple",
      allowed: ["users"],
      macros: {
        kons: "*S:*\n*O:*\n*B:*\n*P:*",
        gw: "Gewicht"
      },
      dummy: true
    }).then(m => {
      logger.info("created dummy macros")
    }).catch(err => {
      logger.error("could not create dummy macro " + err)
    })
  })

  const findings = app.service('findings')
  findings.remove(null, { query: { dummy: true } }).then(removed => {
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
      logger.error("failed creating dummy findings: " + err)
    })
  })

  return true
}
