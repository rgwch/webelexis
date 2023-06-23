/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { logger } from '../logger'


function createTable(db, tableName) {
  return db.schema.createTable(tableName, table => {
    table.string('id', 40).primary().unique().notNullable();
    table.string('deleted', 1)
    table.bigint('lastupdate')
    table.string("stock", 40)
    table.string("article_type", 255)
    table.string("article_id", 40)
    table.int("min")
    table.int("max")
    table.int("current")
    table.int("fractionunits")
    table.string("provider", 40)
  })
}

export default (app) => {
  const db = app.get('knexClient');
  const tableName = 'stock_entry';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      createTable(db, tableName).then(() => {
        logger.info(`Created ${tableName} table`)
      }).catch(err => {
        logger.error(`Error creating ${tableName}`, err)
      })
    }
  })
  return db;
};
