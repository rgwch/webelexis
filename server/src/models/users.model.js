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
        table.string('id',40).primary().unique().notNullable();
        table.string('DELETED',1);
        table.string("KONTAKT_ID",40)
        table.integer("LASTUPDATE")
        table.string("HASHED_PASSWORD",64)
        table.string("SALT",64)
        table.string("IS_ACTIVE",1)
        table.string("IS_ADMINISTRATOR",1)
        table.text("KEYSTORE")
        table.binary("EXTINFO")
        table.string("TOTP",16)
        table.string("ALLOW_EXTERNAL",1).notNullable().default(1)
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
