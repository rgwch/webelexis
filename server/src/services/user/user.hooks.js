/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const handleExtInfo = require('../../hooks/handle-extinfo')
const hashPassword = require('./hash-password')
const hooks= require('@feathersjs/authentication-local').hooks
hooks.hashPassword=hashPassword
const protect=hooks.protect
/**
 * if a user has an associated Elexis 'Kontakt', add this Kontakt to the user object,
 */
const addKontakt = async ctx => {
  const kontaktService = ctx.app.service("kontakt")
  if (ctx.result.kontakt_id) {
    ctx.result._Kontakt = await kontaktService.get(ctx.result.kontakt_id)
  }
  return ctx
}

/**
 * Retrieve and add the user's roles.
 */
const addRoles = async ctx => {
  const db = ctx.service.Model
  const roles = await db('user_role_joint').where("user_id", ctx.id)
  if (!roles || !Array.isArray(roles) || roles.length == 0) {
    ctx.result.roles = ['guest']
  } else {
    ctx.result.roles = roles.map(role => role.id)
  }
  return ctx
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
    all: [protect('hashed_password','salt')],
    find: [],
    get: [addKontakt, addRoles, handleExtInfo({ extinfo: "extinfo" })],
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
