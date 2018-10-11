/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const NeDB = require('nedb');
const path = require('path');

/**
 *  The Webelexis user (which is deliberately /not/ a simple mapping to an elexis-user)
 *  email: string (id)
 *  label: string (common name)
 *  roles: []
 *  elexisuser_id:string id of matching elexis user (if any)
 *  elexis_id: string id of matching elexis Kontakt (if any)
 *
 * @param  app
 */
module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'usr.db'),
    id: "email",
    autoload: true
  });

  Model.ensureIndex({ fieldName: 'email', unique: true });

  return Model;
};
