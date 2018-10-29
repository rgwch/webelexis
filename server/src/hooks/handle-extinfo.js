/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const ElexisUtils = require('../util/elexis-types')
const util = new ElexisUtils()

const defaultOptions={
  extinfo: "extinfo"
}

/**
 * Add a decoded version of the ExtInfo-Field
 * as 'extjson' to the returned object.
 * @param options: 'extinfo': Name of the original
 * ExtInfo field (case sensitive!). Defaults to 'extinfo'
 */

module.exports=function (options=defaultOptions){
  return context=>{
    if (context.result && context.result[options.extinfo]) {
      const obj=context.result
      obj.extjson = util.getExtInfo(obj[options.extinfo])
      context.result=obj
    } else if (context.result.data) {
        for (const obj of context.result.data) {
          const exti = obj[options.extinfo]
          const json = util.getExtInfo(exti)
          obj.extjson = json
        }
      }
      return context
  }

}
