/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
/* eslint-disable no-console */

import {logger} from '../logger'

export default function (app) {
  const db = app.get('knexClient');
  const tableName = 'auf';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable()
        table.string('patientid',40)
        table.string('fallid',40)
        table.string('prozent',3)
        table.string('datumvon',8)
        table.string('datumbis',8)
        table.string('grund',50)
        table.string('aufzusatz')
        table.string('briefid',40)
        table.string('datumauz',8)
        table.string('deleted',1)
        table.bigint('lastupdate')
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
