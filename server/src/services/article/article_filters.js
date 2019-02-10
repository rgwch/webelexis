/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  this.blackbox=options.blackbox || true
  this.generics=options.generics || false

  return async context => {
    
    if(context.params.query){
      if(!context.params.query.deleted){
        context.params.query.deleted="0"
      }
      if(this.blackbox && (context.params.query.blackbox === undefined)){
        context.params.query.bb="0"
      }
      if(this.generics && (context.params.query.generic_type === undefined)){
        context.params.query.$or=[
          {generic_type: "O"},
          {generic_type: "G"},
          {generic_type: "K"}
        ]
      }
    }
    return context;
  };
};
