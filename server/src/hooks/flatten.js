/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
  Replace fields with embedded objects with these objects' id.
  This is used before create and update
  Options: An Array of names of fields which might contain objects instead of strings.
*/
module.exports=fieldlist=>{
  return ctx=>{
    for(const field of fieldlist){
      // note: typeof(null) is 'object'. Don't ask why. So double check here.
      if(ctx.data[field] && typeof(ctx.data[field])=='object'){
        ctx.data[field]=ctx.data[field].id || null
      }
    }
  }
}
