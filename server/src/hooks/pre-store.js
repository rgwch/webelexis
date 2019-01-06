/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const uuid = require('uuid/v4')

/**
 * Avoid duplicate lastupdate fields, generate lastupdate value, make sure, deleted is '0',
 * make sure, the object has an unique id, remove type information.
 * To apply before create and update operations
 * @param {*} obj
 */
const do_prepare = obj => {
  if (obj.hasOwnProperty("LASTUPDATE")) {
    obj.LASTUPDATE = new Date().getTime()
    delete obj.lastupdate
  } else {
    obj.lastupdate = new Date().getTime()
  }
  if (!obj.id) {
    obj.id = uuid()
  }
  delete obj.type
  return obj
}


module.exports = ctx => {
  if (ctx.data) {
    if (Array.isArray(ctx.data)) {
      for (const item of ctx.data) {
        do_prepare(item)
      }
    } else {
      ctx.data = do_prepare(ctx.data)
    }
  }
}
