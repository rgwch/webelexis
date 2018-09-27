/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    if(context.params.query){
      if(!context.params.query.deleted){
        context.params.query.deleted="0"
      }
    }
    return context;
  };
};
