/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { ElexisUtils } from '../util/elexis-types'
const util = new ElexisUtils()

const defaultOptions = {
  extinfo: "extinfo"
}

/**
 * simplify the retrieval of objects from feathers hook functions. Returns always an Array
 * @param {} ctx
 */
const getItems = ctx => {
  if (ctx.type == "before") {
    return Array.isArray(ctx.data) ? ctx.data : [ctx.data]
  } else {
    if (ctx.result) {
      if (ctx.result.data) {
        return ctx.result.data
      } else {
        return Array.isArray(ctx.result) ? ctx.result : [ctx.result]
      }
    }
  }
}

/**
 * Add a decoded version of the ExtInfo-Field
 * as 'extjson' to the returned object.
 * @param options: 'extinfo': Name of the original
 * ExtInfo field (case sensitive!). Defaults to 'extinfo'
 */

export default function (options = defaultOptions) {
  return context => {
    if (context.method == "get" || context.method == "find") {
      const items = getItems(context)
      for (const obj of items) {
        if (obj[options.extinfo]) {
          obj.extjson = util.getExtInfo(obj[options.extinfo])
          if (obj.extjson) {
            delete obj[options.extinfo]
          } else {
            obj.extjson = { "error": "extinfo" }
          }
        } else {
          obj.extjson = {}
        }
      }
    } else if (context.method == "create" || context.method == "update" || context.method == "patch") {
      const items = getItems(context)
      for (const obj of items) {
        if (obj.extjson) {
          obj[options.extinfo] = Buffer.from(util.writeExtInfo(obj.extjson))
        }
        delete obj.extjson
      }
    }
    return context
  }
}
