/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const treatDeleted = require('../../hooks/treat-deleted');
const handleExtInfo = require('../../hooks/handle-extinfo');

/**
 * Check if there's a '$find' property in the query, and if so, make a LIKE - query over
 * firstname, lastname and birthdate fields with the expression in $find. If there's no
 * such field, just transmit the query as is to the underlying service.
 * @param {} options
 */
const doQuery = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {

    if (context.params.query && context.params.query.$find) {
      //console.log("$find requested: "+JSON.stringify(context))
      let expr = context.params.query.$find
      if (/^[0-9]{4}$/.test(expr)) {
        context.params.query.Geburtsdatum = { $like: expr + "%" }
      } else if (/^[0-9]{1,2}\.[0-9]{1,2}\.?$/.test(expr)) {
        let md = expr.split(".")
        if (md[0].length == 1) {
          md[0] = "0" + md[0]
        }
        if (md[1].length == 1) {
          md[1] = "0" + md[1]
        }
        context.params.query.Geburtsdatum = { $like: "%" + md[1] + md[0] }
      } else if (/^[0-3][0-9]\.[01][0-9]\.[12][90][0-9][0-9]$/.test(expr)) {
        let dat = expr.substr(6, 4) + expr.substr(3, 2) + expr.substr(0, 2)
        context.params.query.Geburtsdatum = dat
      } else {
        if (!expr.endsWith("%")) {
          expr = expr + "%"
        }
        context.params.query.$or = [
          { "Bezeichnung1": { $like: expr } },
          { "Bezeichnung2": { $like: expr } },
          { "Bezeichnung3": { $like: expr } }
        ]
      }
      delete context.params.query.$find
    }
    return context;
  };
};

/**
 * Add an "order by" clause for lastname, firstname and birthdate to the query
 * @param {*} context
 */
const doSort = context => {
  const query = context.app.service('kontakt').createQuery({
    query: context.params.query
  })
  query.orderByRaw('Bezeichnung1,Bezeichnung2,geburtsdatum')
  context.params.knex = query
  return context
}


module.exports = {
  before: {
    all: [],
    find: [treatDeleted(), doQuery(), doSort],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [handleExtInfo()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
