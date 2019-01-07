/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

/**
 * Try to add a matching elexis user. If none found
 * try to add a matching elexis Kontakt
 * @param {} context
 */
const addElexisUser = async context => {
  if (context.result.elexisuser_id) {
    const userService = context.app.service('users')
    const user = await userService.get(context.result.elexisuser_id)
    if (user) {
      context.result.elexiskontakt = user
    }
  } else if (context.result.elexis_id) {
    const kontaktService = context.app.service('kontakt')
    const kontakt = await kontaktService.get(context.result.elexis_id)
    if (kontakt) {
      context.result.elexiskontakt = kontakt
    }
  }
  return context
}

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword()],
    update: [hashPassword(), authenticate('jwt')],
    patch: [hashPassword(), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [addElexisUser],
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
