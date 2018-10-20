/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

 /*
  * connection to the Elexis database is via knex (https://knexjs.org)
  * here we configure our knex instance.
  */

const knex = require('knex');

module.exports = function (app) {
  // const { client, connection } = app.get('mysql');
  const { client, connection } = app.get('postgresql');
  const db = knex({ client, connection });

  app.set('knexClient', db);
};
