/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const decomposeId = function (options = {}) {
  return async (context) => {
    let splid = context.id.split(":")
    let user = await context.app.service('users').get(splid[0])
    if (user && user.KONTAKT_ID) {
      let found = await context.service.find({
        query: {
          userid: user.KONTAKT_ID,
          param: splid[1]
        }
      })
      context.result=found
      
      if(found.total>0){
        context.result=found.data[0].Value
      }else{
        context.result=""
      }
      return context;
    }
  }
}

const resolveUser=function(options={}){
  return async context=>{
    if(context.params.query){
      let username=context.params.query.user
      if(username){
        let user=await context.app.service("users").get(username)
        if(user){
          delete context.params.query.user
          context.params.query.userid=user.KONTAKT_ID
          return context
        }else{
          throw(new Error("user not found"))
        }
      }
    }
  }
}

module.exports = {
  before: {
    all: [],
    find: [resolveUser()],
    get: [decomposeId()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
