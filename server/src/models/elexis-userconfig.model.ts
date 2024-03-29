/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../logger'

export default function (app) {
  const db = app.get('knexClient');
  const tableName = 'userconfig';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => {
        table.string('userid', 40)
        table.string('param', 80);
        table.string('value');
        table.bigint('lastupdate')
        table.string("deleted", 1)
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
