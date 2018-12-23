/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const ElexisUtils = require('../util/elexis-types')
const util = new ElexisUtils()

const defaultOptions = {
  extinfo: "extinfo"
}

/**
 * Add a decoded version of the ExtInfo-Field
 * as 'extjson' to the returned object.
 * @param options: 'extinfo': Name of the original
 * ExtInfo field (case sensitive!). Defaults to 'extinfo'
 */

module.exports = function (options = defaultOptions) {
  return context => {
    if (context.method == "get" || context.method == "find") {
      if (context.result && context.result[options.extinfo]) {
        const obj = context.result
        if (obj.extinfo) {
          obj.extjson = util.getExtInfo(obj[options.extinfo])
          context.result = obj
        } else if (context.result.data) {
          for (const obj of context.result.data) {
            const exti = obj[options.extinfo]
            const json = util.getExtInfo(exti)
            obj.extjson = json
          }
        }
      }
    } else if (context.method == "create" || context.method == "update") {
      if (context.data && context.data.extjson) {
        if (context.data.extjson != {}) {
          context.data[options.extinfo] = util.writeExtInfo(context.data.extJson)
        }
        delete context.data.extjson
      }
      return context
    }
  }
}
