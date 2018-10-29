/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const uuid = require('uuid/v4')
// eslint-disable-next-line no-unused-vars

/**
 * make sure every newly created object has an id and lastupdate/deleted fields
 */
module.exports = function (options = {}) {
  return async context => {
    if(context.data){
      if(!context.data.id){
        context.data.id=uuid()
      }
      context.data.lastupdate=new Date().getTime();
      context.data.deleted="0";
    }
    return context;
  };
};
