/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { needsRight } = require('../util/acl')

module.exports = ctx => {
  if (ctx.type == "before" && ctx.params && ctx.params.provider) {
    const servicename = ctx.path
    const method = ctx.method
    const user = ctx.params.user
    const neededACE = servicename + "." + method
    if (servicename == 'user' && method == 'get' && user && ctx.id == user.id) {
      ctx.result = user
    } else {
      needsRight(user, neededACE)
    }
    return ctx
  }
}
