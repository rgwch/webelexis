/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const logger = require('../logger')

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'briefe';
  const types=["Vorlagen","AUF-Zeugnis","Rezept","Allg.","Labor","Bestellung","Rechnung"]
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string('deleted',1);
        table.bigint("LASTUPDATE")
        table.string('Betreff')
        table.string('Datum',24)
        table.string('modifiziert',24)
        table.string('gedruckt',8)
        table.string('absenderid',40)
        table.string('destid',40)
        table.string('behandlungsid',40)
        table.string('patientid',40)
        table.string('typ',30)
        table.string('MimeType',80)
        table.string('path')
        table.string('note')
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
