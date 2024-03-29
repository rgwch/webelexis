/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 * connection to the Elexis database is via knex (https://knexjs.org)
 * here we configure our knex instance. The client credentials are
 * configured in ./configuration.ts
 */

import knex from "knex"
import { logger } from "./logger"
import fs from "fs"
const path = require("path")
const normalize = require('./normalize_db')

export default function (app) {
  const elexisdb = app.get("elexisdb")

  const connection = {
    host: process.env.DBHOST || elexisdb?.connection?.host || "localhost",
    port: process.env.DBPORT || elexisdb?.connection?.port || 3306,
    database: process.env.DBNAME || elexisdb?.connection?.database || "elexis",
    user: process.env.DBUSER || elexisdb?.connection?.user || "elexisuser",
    password: process.env.DBPWD || elexisdb?.connection?.password || "elexis"
  }

  const db = knex({
    client: elexisdb.client,
    connection,
    pool: { max: 50 }
  })
  db("config")
    .select("wert")
    .where("param", "webelexis")
    .then(async result => {
      if (result && result.length > 0) {
        logger.info("Found Webelexis Version %s", result[0].wert)
        if (result[0].wert < "3.0.6") {
          // Database - webelexis version too old, normalize
          return normalize(app).then(() => {
            return db('config').where("param", "webelexis").update("wert", "3.0.6").then(res => {
              logger.info(res)
            })
          }).catch(err => {
            logger.error("Fehler beim DB update " + err)
          })
        }
      } else {
        // No database-webelexis version found at all. Normalize and modify.
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
        logger.error("\n\n*** ABORT: Can't connect do elexis database: %s ***\n\n", err)
        process.exit(42)
      }
    })
  app.set("knexClient", db)
}
