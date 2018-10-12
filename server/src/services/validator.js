/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const _ = require('lodash')

const validators=new Map()

const validate=(object, name, doThrow)=>{
  const template=validators[name]
  if(!template){
    throw new Error("Validator: invalid template ")
  }
  _.forOwn(object, ((value, key) => {
    if (!template[key]) {
      delete object[key]
      if (doThrow) {
        throw new Error("invalid object " + object)
      }
    }
  }))
  return object
}

/*
fields: fieldname: {defaultValue:null,maxLength:10,nullable:true,type:"varchar"}
*/
const initialize=(name,fields)=>{
  validators[name]=fields
}

module.exports={validate,initialize}
