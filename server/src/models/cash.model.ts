/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2023 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../logger'

export default function (app) {
    const db = app.get('knexClient');
    const tableName = 'ch_elexis_kassenbuch';
    db.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            db.schema.createTable(tableName, table => {
                table.string('id', 40).primary().unique().notNullable();
                table.string('nr', 40);
                table.string('date', 8);
                table.string('amount', 8)
                table.string('total', 8)
                table.string('entry', 80)
                table.string('category', 80)
                table.binary('paymentmode', 80)
                table.string('deleted', 1)
                table.bigint('lastupdate')
            })
                .then(() => logger.info(`Created ${tableName} table`))
                .catch(e => logger.error(`Error creating ${tableName} table`, e));
        }
    });


    return db;
};
