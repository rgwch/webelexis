/* eslint-disable no-console */

import { logger } from '../logger'

export default function (app) {
  const db = app.get('knexClient');
  const etikettenTable = 'etiketten';
  const linkTable = 'etiketten_object_link'
  const imageTable = 'dbimage'
  db.schema.hasTable(etikettenTable).then(exists => {
    if (!exists) {
      db.schema.createTable(etikettenTable, table => {
        table.string('id', 40).unique().notNullable().primary();
        table.string('image', 40)
        table.string('deleted', 1)
        table.string('importance', 7)
        table.string('name', 40)
        table.string('foreground', 6)
        table.string('background', 6)
        table.string('classes')
        table.bigint('lastupdate');
      })
        .then(() => logger.info(`Created ${etikettenTable} table`))
        .catch(e => logger.error(`Error creating ${etikettenTable} table`, e));
    }
  });

  db.schema.hasTable(linkTable).then(exists => {
    if (!exists) {
      db.schema.createTable(linkTable, table => {
        table.string('obj', 40)
        table.string('etikette', 40)
        table.bigint('lastupdate')
      })
        .then(() => logger.info(`Created ${linkTable} table`))
        .catch(e => logger.error(`Error creating ${linkTable} table`, e));
    }
  })

  db.schema.hasTable(imageTable).then(exists => {
    if (!exists) {
      db.schema.createTable(imageTable, table => {
        table.string('id', 40).primary().unique().notNullable()
        table.string('deleted', 1)
        table.string('datum', 8)
        table.string('title')
        table.binary('bild')
        table.bigint('lastupdate')
        table.string("prefix")
      }).then(() => logger.info(`Created ${imageTable} table`))
        .catch(e => logger.error(`Error creating ${imageTable} table`, e));
    }
  })

  return db;
};
