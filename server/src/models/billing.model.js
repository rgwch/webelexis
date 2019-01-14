/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const logger = require('../logger')

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'leistungen';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string("deleted",1)
        table.bigint("LASTUPDATE")
        table.string('behandlung',40)
        table.string('leistg_txt')
        table.string('leistg_code',40)
        table.string("klasse",80)
        table.string("zahl",3)
        table.string('ek_kosten',6)
        table.string('VK_TP',8)
        table.string('VK_SCALE',8)
        table.string('vk_preis',6)
        table.string('SCALE',4)
        table.string('SCALE2',4)
        table.string('userID',40)
        table.binary('DETAIL')
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
