/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2024 by G. Weirich    *
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
import normalize from "./normalize_db"

export default async function (app): Promise<any> {
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

  const check = await db.raw("select 1+1 as result")
  if (check) {
    logger.info("Connected to database")
    await configure(app, db)
    return db
  } else {
    throw new Error("can't read from database")
  }


}

async function configure(app, db) {
  logger.warn("Checking Webelexis Version")
  try {
    const result = await db("config").select("wert").where("param", "webelexis")
    if (result && result.length > 0) {
      logger.info("Found Webelexis Version %s", result[0].wert)
      if (result[0].wert < "3.0.6") {
        // Database - webelexis version too old, normalize
        logger.warn("Database version too old. Normalizing")
        await normalize(app)
        const res = await db('config').where("param", "webelexis").update("wert", "3.0.6")
        logger.info(res)
      } else {
        // No database-webelexis version found at all. Normalize and modify.
        await normalize(app)
        await db("config").insert({ param: "webelexis", wert: "3.0.6" })
        logger.warn("webelexis config entry not found")
        const script = fs.readFileSync("./modify_elexis.sql", "utf-8")
        const statements = script.split(";")
        const execs = []
        for (const stm of statements) {
          try {
            await db.raw(stm.replace(/[\n\r]/, ""))
          } catch (err) {
            logger.warn("statement failed: %s", err)
          }
        }
        const version = app.get("version")
        await db("config").insert({ param: "webelexis", wert: version })
        logger.info("script finished")
      }
    }
  } catch (err) {
    /*
      Probably we get an error because the table "config" doesn not exist at all - in
      that case, we're running from scratch. So ER_NO_SUCH_TABLE is not a fatal error.
      All other errors are treated as fatal connection failures.
    */
    logger.warn(err)
    if (err.code != "ER_NO_SUCH_TABLE") {
      logger.error("\n\n*** ABORT: Can't connect do elexis database: %s ***\n\n", err)
      process.exit(42)
    } else {
      console.log(err)
    }
  }
}