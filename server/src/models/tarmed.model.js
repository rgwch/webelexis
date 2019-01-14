/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/* eslint-disable no-console */

const logger = require('../logger')

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'tarmed';
  const extensionName= 'tarmed_extension'
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string("deleted",1)
        table.bigint("lastupdate")
        table.string('Parent',32)
        table.string('DigniQuali',4)
        table.string('DigniQuanti',5)
        table.string('Sparte',4)
        table.string('GueltigVon',8)
        table.string('GueltigBis',8)
        table.string('Nickname',25)
        table.string('tx255')
        table.string('code',25)
        table.string('Law',3)
        table.string('ischapter',1)
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });

  db.schema.hasTable(extensionName).then(exists=>{
    if(!exists){
      db.schema.createTable(extensionName, table=>{
        table.string("Code",40)
        table.binary("limits")
        table.text("med_interpret",2048)
        table.text("text_interpret",2048)
        table.text("id",40)
        table.bigint("lastupdate")
        table.string("deleted",1)
      })
      .then(() => logger.info(`Created ${extensionName} table`))
      .catch(e => logger.error(`Error creating ${extensionName} table`, e));
    }
  })

  return db;
};
