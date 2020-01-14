/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const uuid = require("uuid/v4")

/**
 * Generate lastupdate value, make sure, deleted is '0',
 * make sure, the object has an unique id, remove type information.
 * To apply before create and update operations
 * @param {*} obj
 */
const do_prepare = (obj, method) => {

  obj.lastupdate = new Date().getTime();
  if (!obj.id) {
    obj.id = uuid()
  }
  if (method == "create") {
    obj.deleted = "0"
  }
  delete obj.type
  return obj
}

module.exports = ctx => {
  if (ctx.data) {
    if (Array.isArray(ctx.data)) {
      for (const item of ctx.data) {
        do_prepare(item, ctx.method)
      }
    } else {
      ctx.data = do_prepare(ctx.data, ctx.method)
    }
  }
}
