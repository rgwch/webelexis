/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
import handleExtInfo from '../../hooks/handle-extinfo'
import hashPassword from './hash-password'
import { logger } from '../../logger'
const hooks = require('@feathersjs/authentication-local').hooks
hooks.hashPassword = hashPassword
const protect = hooks.protect
/**
 * if a user has an associated Elexis 'Kontakt', add this Kontakt to the user object,
 */
const addKontakt = async ctx => {
  const kontaktService = ctx.app.service("kontakt")
  if (ctx.result.kontakt_id) {
    ctx.result._Kontakt = await kontaktService.get(ctx.result.kontakt_id)
    ctx.result._Mandator = ctx.result._Kontakt
    ctx.result._Mandators = ctx.result._Kontakt.bezeichnung3
    const extinfo = ctx.result._Kontakt.extjson
    if (extinfo) {
      const mandatorList = extinfo.Mandant
      if (mandatorList) {
        ctx.result._Mandators = mandatorList
        const mandators = mandatorList.split(",")
        if (mandators && mandators.length > 0) {
          const mainMandatorLabel = mandators[0]
          const qq = await kontaktService.find({ query: { bezeichnung3: mainMandatorLabel } })
          if (qq && qq.data && qq.data.length) {
            // use 'get' command to decode extinfo field
            ctx.result._Mandator = await kontaktService.get(qq.data[0].id)
          }
        }
      }
    }

  }
  return ctx
}

/**
 * Retrieve and add the user's roles.
 */
const _addRoles = async (db, user) => {
  const roles = await db('user_role_joint').where("user_id", user.id)
  if (!roles || !Array.isArray(roles) || roles.length == 0) {
    user.roles = ['guest']
  } else {
    user.roles = roles.map(role => role.id)
  }
  if (user.is_administrator == "1") {
    user.roles.push("admin")
  }
}
const addRoles = async ctx => {
  const db = ctx.service.Model
  if (ctx.method === "find") {
    for (const user of ctx.result.data) {
      await _addRoles(db, user)
    }
  } else {
    await _addRoles(db, ctx.result)
  }
  return ctx
}

/**
 * put roles into user_role_joint
 */
const applyRoles = async ctx => {
  const db = ctx.service.Model
  const roles = ctx.data.roles
  for (const role of roles) {
    if (role !== "guest") {
      await db('user_role_joint').insert({ id: role, user_id: ctx.data.id, deleted: "0", lastupdate: new Date().getTime() })
    }
  }
  delete ctx.data.roles
  return ctx
}

const removeRoles = async ctx => {
  const db = ctx.service.Model
  const users = ctx.result
  for (const user of users) {
    const dlt = db("user_role_joint").where("user_id", user.id).del()
    logger.info(dlt.toString())
    await dlt
  }
  return ctx
}
export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword(), applyRoles, handleExtInfo()],
    update: [hashPassword(), authenticate('jwt'), handleExtInfo()],
    patch: [hashPassword(), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [protect('hashed_password', 'salt')],
    find: [addRoles],
    get: [addKontakt, addRoles, handleExtInfo({ extinfo: "extinfo" })],
    create: [],
    update: [],
    patch: [],
    remove: [removeRoles]
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
