const logger = require('./logger')
module.exports = function (app) {

  const docs = app.service('documents')
  docs.get("1").then(doc => {
    logger.info("basic template found")
  }).catch(err => {
    const fs = require('fs')
    const path = require('path')
    const tmpl = fs.readFileSync(path.join(__dirname, "services/documents/example-template.html"))
    const doc = {
      id: "1",
      "template": "1",
      "subject": "Brief Demo",
      "dummy": true,
      contents: tmpl.toString()
    }
    docs.create(doc).then(resp => {
      logger.info("created dummy document")
    }).catch(err => {
      logger.error(err)
    })
  })

  const usr = app.service('usr')
  const guest = {
    email: "guest@some.where",
    password: "gast",
    roles: ["guest"],
    dummy: true
  }
  const admin = {
    email: "admin@webelexis.ch",
    password: "admin",
    roles: ["admin"],
    dummy: true
  }
  const user = {
    email: "user@webelexis.ch",
    password: "user",
    roles: ["user", "guest"],
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
      creator: "özelditz",
      allowed: ["users"],
      macros: {
        kons: "*S:*\n*O:*\n*B:*\n*P:*",
        gw: "Gewicht"
      },
      dummy: true
    }).then(m=>{
      logger.info("created dummy macros")
    }).catch(err=>{
      logger.error("could not create dummy macro "+err)
    })
  })
}
