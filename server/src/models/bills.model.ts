/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../logger'
/* eslint-disable no-console */

// bills-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
export default function (app) {
  const db = app.get('knexClient');
  const tableName = 'rechnungen';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id', 40).primary().unique().notNullable();
        table.string('deleted', 1);
        table.bigint("lastupdate")
        table.string('rnnummer', 8)
        table.string('mandantid', 40)
        table.string('rndatum', 8)
        table.string('rnstatus', 20)
        table.string('rndatumvon', 8)
        table.string('rndatumbis', 8)
        table.string('betrag', 8)
        table.string('statusdatum', 8)
        table.binary('extinfo')

      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
};

/* rnstatus
UNKNOWN(0),
  BILLED(1),
  NOT_BILLED(2),
  ONGOING(3),
  OPEN(4),
  OPEN_AND_PRINTED(5),
  DEMAND_NOTE_1(6),
  DEMAND_NOTE_1_PRINTED(7),
  DEMAND_NOTE_2(8),
  DEMAND_NOTE_2_PRINTED(9),
  DEMAND_NOTE_3(10),
  DEMAND_NOTE_3_PRINTED(11),
  IN_EXECUTION(12),
  PARTIAL_LOSS(13),
  TOTAL_LOSS(14),
  PARTIAL_PAYMENT(15),
  PAID(16),
  EXCESSIVE_PAYMENT(17),
  CANCELLED(18), // entspricht Rn.Status STORNIERT
  FROM_TODAY(19),
  NOT_FROM_TODAY(20),
  NOT_FROM_YOU(21),
  DEFECTIVE(22),
  TO_PRINT(23),
  OWING(24),
  STOP_LEGAL_PROCEEDING(25),
  DEPRECIATED(26), // (Abgeschrieben) Storniert und Kons nicht mehr freigegeben
  REJECTED(27);
  */
