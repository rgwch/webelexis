/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const logger = require('../logger')
module.exports = async function (app) {
  const db = app.get('knexClient');
  const tableName = 'ch_elexis_stickynotes';
  const exists = await db.schema.hasTable(tableName)
  if (!exists) {
    try {
      db.schema.createTable(tableName, table => {
        table.string('id', 40).unique().notNullable().primary();
        table.string('deleted', 1)
        table.bigint('lastupdate');
        table.string('patientid', 40);
        table.text('contents')
      })
      logger.info(`Created ${tableName} table`)
    } catch (err) {
      logger.error(`Error creating ${tableName} table`, err);
    }
  }
  return db;
};
