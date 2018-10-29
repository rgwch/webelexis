/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

 /**
  * Wehen an object is updated, set 'lastupdate' field correctly
  * and make sure, 'deleted' is '0'.
  */
module.exports=function(options={}){
  return context=>{
    if(context.data){
      context.data.lastupdate=new Date().getTime();
      context.data.deleted="0";
    }
  }
}
