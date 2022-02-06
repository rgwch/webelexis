/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { logger } from '../logger'


export default (app) => {
  const db = app.get('knexClient');
  const tableName = 'config';
  const initialValues = [
    ["PatientNummer", "0"],
    ["RechnungsNr", "0"],
    ["dbversion", "4.0"],
    ["webelexis", app.get("version")],
    ["ElexisVersion", "3.5.0"],

  ]

  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => {
        table.string('param')
        table.string('wert');
        table.string("deleted", 1),
          table.bigint('lastupdate')
      })
        .then(async () => {
          logger.info(`Created ${tableName} table`)
          for (const v of initialValues) {
            await db(tableName).insert({
              "param": v[0],
              "wert": v[1]
            })
            logger.info("inserted config %s=%s", v[0], v[1])
          }
        })
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
