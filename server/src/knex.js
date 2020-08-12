/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 * connection to the Elexis database is via knex (https://knexjs.org)
 * here we configure our knex instance. The client credentials are
 * configured in /config/*.json
 */

const knex = require("knex")
const logger = require("./logger")
const fs = require("fs")
const path = require("path")
const normalize = require('./normalize_db')

module.exports = function (app) {
  // uncomment exactly one of the following three lines
  const { client, connection } = app.get("mysql")
  // const { client, connection } = app.get('postgresql');
  // const {client,connection} = app.get("sqlite");
  const conf = app.get("userconfig")  // = ../data/settings.js
  logger.info("Settingsname: " + conf.settingsname)
  logger.info("config name: " + app.get("configname"))
  const dbconf = {
    host: process.env.DBHOST || conf.elexisdb.host || "localhost",
    port: process.env.DBPORT || conf.elexisdb.port || 3306,
    database: process.env.DBNAME || conf.elexisdb.database,
    user: process.env.DBUSER || conf.elexisdb.user || "elexisuser",
    password: process.env.DBPWD || conf.elexisdb.password || "elexis"
  }

  const db = knex({
    client,
    connection: dbconf || connection,
    pool: { max: 50 }
  })
  db("config")
    .select("wert")
    .where("param", "webelexis")
    .then(async result => {
      if (result && result.length > 0) {
        logger.info("Found Webelexis Version %s", result[0].wert)
        if (result[0].wert < "3.0.6") {
          return normalize(app).then(() => {
            return db('config').where("param", "webelexis").update("wert", "3.0.6").then(res => {
              console.log(res)
            })
          }).catch(err => {
            logger.error("Fehler beim DB update " + err)
          })
        }
      } else {
        const conf = app.get("userconfig")
        return normalize(app).then(() => {
          return db("config")
            .insert({ param: "webelexis", wert: "3.0.6" })
        }).then(() => {
          logger.warn("webelexis config entry not found")
          const script = fs.readFileSync("./modify_elexis.sql", "utf-8")
          const statements = script.split(";")
          const execs = []
          for (const stm of statements) {
            execs.push(
              db.raw(stm.replace(/[\n\r]/, "")).catch(err => {
                logger.warn("statement failed: %s", err)
              })
            )
          }
          return Promise.all(execs).then(res => {
            const version = app.get("version")
            return db("config")
              .insert({ param: "webelexis", wert: version })
              .then(r => {
                logger.info("script finished")
              })
          })
        }).catch(err => {
          logger.error("could not update version %s", err)
        })

      }
    })
    .catch(err => {
      /*
        Probably we get an error because the table "config" doesn not exist at all - in
        that case, we're running from scratch. So ER_NO_SUCH_TABLE is not a fatal error.
        All other errors are treated as fatal connection failures.
      */
      if (err.code != "ER_NO_SUCH_TABLE") {
        logger.error("Can't connect do database: %s ", err)
        process.exit(42)
      }
    })
  app.set("knexClient", db)
}
