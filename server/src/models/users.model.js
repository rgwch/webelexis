/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

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
        table.string('ID');
        table.string('DELETED');
        table.string("KONTAKT_ID")
        table.integer("LASTUPDATE")
        table.string("HASHED_PASSWORD")
        table.string("SALT")
        table.string("IS_ACTIVE")
        table.string("IS_ADMINISTRATOR")
        table.string("KEYSTORE")
        table.binary("EXTINFO")
        table.string("APIKEY")
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
