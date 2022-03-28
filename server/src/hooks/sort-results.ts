/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

 export default function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    if(context.params.query){
      context.params.query.$sort={
        [context.params.sortBy]:1
      }
    }
    return context;
  };
};
