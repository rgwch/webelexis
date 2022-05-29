import { logger } from '../logger'
/* eslint-disable no-console */

// payments-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
export default function (app) {
  const db = app.get('knexClient')
  const tableName = 'zahlungen'
  db.schema.hasTable(tableName).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(tableName, (table) => {
          table.string('id', 40).primary().unique().notNullable()
          table.string('rechnungsid', 40)
          table.string('betrag', 8)
          table.string('datum', 8)
          table.string('bemerkung', 80)
          table.string('deleted', 1)
          table.bigint('lastupdate')
        })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch((e) => logger.info(`Error creating ${tableName} table`, e))
    }
  })

  return db
}
