/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2024 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Normalize database, i.e. convert all table names and field names to lowercase.
 */
import { logger } from "./logger"

export default async app => {
  const modify = async tableName => {
    const columns = await knex.table(tableName).columnInfo()
    for (const key of Object.keys(columns)) {
      if (key.toLocaleLowerCase() !== key) {
        try {
          await knex.schema.table(tableName, table => {
            table.renameColumn(key, key.toLocaleLowerCase())
            logger.info("changed " + tableName + "." + key)
          })
        } catch (err) {
          logger.error(err)
        }
      }
    }
    return "ok"
  }

  const knex = app.get("knexClient")
  const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = ?"
  const bindings = [knex.client.database()]
  const results = await knex.raw(query, bindings)
  for (const row of results[0]) {
    const name = row.TABLE_NAME || row.table_name
    logger.info("modifying " + name)
    if (name !== name.toLocaleLowerCase()) {
      await knex.schema.renameTable(name, name + "_temp")
      await knex.schema.renameTable(name + "_temp", name.toLocaleLowerCase())
    }
    await modify(name.toLocaleLowerCase())
  }
  return true
}
