/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Process a query term like "userid:parameter".
 * Find a User (from user_) with that id, retrieve
 * the matching Elexis Kontakt and convert the query
 * accordingly
 * @param {*} options
 */
const decomposeId = function (options = {}) {
  return async (context) => {
    let splid = context.id.split(":")
    let user = await context.app.service('user').get(splid[0])
    if (user && user.kontakt_id) {
      let found = await context.service.find({
        query: {
          userid: user.kontakt_id,
          param: splid[1]
        }
      })
      context.result = found

      if (found.total > 0) {
        context.result = found.data[0].value
      } else {
        context.result = ""
      }
      return context;
    }
  }
}

const resolveUser = function (options = {}) {
  return async context => {
    if (context.params.query) {
      let username = context.params.query.user
      if (username) {
        let user = await context.app.service("user").get(username)
        if (user) {
          delete context.params.query.user
          context.params.query.userid = user.kontakt_id
          return context
        } else {
          throw (new Error("user not found"))
        }
      }
    }
  }
}

module.exports = {
  before: {
    all: [],
    find: [resolveUser()],
    get: [decomposeId()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
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
