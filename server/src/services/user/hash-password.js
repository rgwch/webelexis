/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const log = require('../../logger')
const ElexisUtils = require('../../util/elexis-types')
const util = new ElexisUtils()

module.exports = function hashPassword(options = {}) {
  return async ctx => {
    if (!ctx.data) {
      log.warn("hashPassword: no data. skipping")
      return ctx;
    }
    const dataIsArray = Array.isArray(ctx.data)
    const data = dataIsArray ? ctx.data : [ctx.data]
    const hashed = data.map(elem => {
      const pwraw = elem.hashed_password
      if (pwraw) {
        const processed = util.hashPassword(pwraw)
        elem.hashed_password = processed.hashed
        elem.salt = processed.salt
      }
      return elem
    })
    ctx.data = dataIsArray ? hashed : hashed[0]
    return ctx;
  }

}
