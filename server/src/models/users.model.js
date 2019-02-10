/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const logger = require('../logger')

 /**
  * An Elexis user
  * @param {*} app
  */
module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'user_';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string('deleted',1)
        table.string("kontakt_id",40)
        table.bigint("lastupdate")
        table.string("hashed_password",64)
        table.string("salt",18)
        table.string("is_active",1)
        table.string("is_administrator",1)
        table.text("keystore")
        table.binary("extinfo")
        table.string("totp",16)
        table.string("allow_external",1).notNullable().default(1)
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
