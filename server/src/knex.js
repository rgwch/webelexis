/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 * connection to the Elexis database is via knex (https://knexjs.org)
 * here we configure our knex instance. The client credentials are
 * configured in /config/*.json
 */

const knex = require('knex');

module.exports = function (app) {
  // undocument exactly one of the following three lines
  const { client, connection } = app.get('mysql');
  // const { client, connection } = app.get('postgresql');
  // const {client,connection} = app.get("sqlite");
  const db = knex({ client,
      connection: app.get("userconfig").elexisdb || connection,
      pool: { max: 50 } });

  app.set('knexClient', db);
};
