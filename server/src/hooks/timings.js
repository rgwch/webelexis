/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

 const log=require('../logger')
/**
 * If the query states no value for 'deleted', add a 'deleted='0' clause.
 * Except elexis-userconfig (table has no 'deleted' field)
 * @param {*} options
 */
module.exports = function(options = {}) {
  return context => {
    if(context.type=="before"){
      log.info("timings for "+context.path)
      log.info("query: ",context.params.query)
      context.params.timer=new Date().getTime()
    }else{
      if(context.params.timer){
        const duration=(new Date().getTime() - context.params.timer)/1000
        log.info("time was "+duration)
      }
    }
    return context
  }
}
