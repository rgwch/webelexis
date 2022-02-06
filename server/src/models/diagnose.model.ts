/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../logger'

export const createModel = (app) => {
  const db = app.get('knexClient');
  const tableName = 'diagnosen';
  const jointTable = 'behdl_dg_joint'
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id', 40).primary().unique().notNullable()
        table.string('dg_text', 255);
        table.string('dg_code', 25)
        table.string("klasse", 80)
        table.string("deleted", 1)
        table.bigint("lastupdate")
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });
  db.schema.hasTable(jointTable).then(exists => {
    if (!exists) {
      db.schema.createTable(jointTable, table => {
        table.string('id', 40).primary().unique().notNullable()
        table.string("behandlungsid", 40)
        table.string("diagnoseid", 40)
        table.string("deleted", 1)
        table.bigint("lastupdate")
      })
        .then(() => logger.info(`Created ${jointTable} table`))
        .catch(e => logger.error(`Error creating ${jointTable} table`, e.message));

    }
  })

  return db;
};
