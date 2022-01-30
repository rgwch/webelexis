/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/* eslint-disable no-console */

import { logger } from '../logger'

module.exports = function (app) {
  const db = app.get('knexClient')
  const tableName = 'tarmed'
  const extensionName = 'tarmed_extension'
  db.schema.hasTable(tableName).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(tableName, (table) => {
          table.string('id', 40).primary().unique().notNullable()
          table.string('deleted', 1)
          table.bigint('lastupdate')
          table.string('parent', 32)
          table.string('digniquali', 4)
          table.string('digniquanti', 5)
          table.string('sparte', 4)
          table.string('gueltigvon', 8)
          table.string('gueltigbis', 8)
          table.string('nickname', 25)
          table.string('tx255')
          table.string('code', 25)
          table.string('law', 3)
          table.string('ischapter', 1)
        })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch((e) => logger.error(`Error creating ${tableName} table`, e))
    }
  })

  db.schema.hasTable(extensionName).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(extensionName, (table) => {
          table.string('code', 40)
          table.binary('limits')
          table.text('med_interpret', 2048)
          table.text('text_interpret', 2048)
          table.text('id', 40)
          table.bigint('lastupdate')
          table.string('deleted', 1)
        })
        .then(() => logger.info(`Created ${extensionName} table`))
        .catch((e) => logger.error(`Error creating ${extensionName} table`, e))
    }
  })

  return db
}
