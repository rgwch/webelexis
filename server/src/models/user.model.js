/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../logger'

/**
 * An Elexis / Webelexis user
 */
module.exports = function (app) {
  const db = app.get('knexClient')
  const userTable = 'user_'
  const roleTable = 'role'
  const userRoleTable = 'user_role_joint'
  db.schema.hasTable(userTable).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(userTable, (table) => {
          table.string('id', 40).primary().unique().notNullable()
          table.string('deleted', 1)
          table.string('kontakt_id', 40)
          table.bigint('lastupdate')
          table.string('hashed_password', 64)
          table.string('salt', 18)
          table.string('is_active', 1)
          table.string('is_administrator', 1)
          table.text('keystore')
          table.binary('extinfo')
          table.string('totp', 16)
          table.string('allow_external', 1).notNullable().default(1)
        })
        .then(() => logger.info(`Created ${userTable} table`))
        .catch((e) => logger.error(`Error creating ${userTable} table`, e))
    }
  })
  db.schema.hasTable(roleTable).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(roleTable, (table) => {
          table.string('id', 40).primary().notNullable()
          table.string('deleted', 1)
          table.string('issystemrole', 1)
          table.bigint('lastupdate')
          table.binary('extinfo')
        })
        .then(() => logger.info(`Created ${roleTable} table`))
        .catch((e) => logger.error(`Error creating ${roleTable} table`, e))
    }
  })
  db.schema.hasTable(userRoleTable).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(userRoleTable, (table) => {
          table.string('id', 40).primary().unique().notNullable()
          table.string('user_id', 40)
          table.string('deleted', 1)
          table.bigint('lastupdate')
        })
        .then(() => logger.info(`Created ${userRoleTable} table`))
        .catch((e) => logger.error(`Error creating ${userRoleTable} table`, e))
    }
  })

  return db
}
