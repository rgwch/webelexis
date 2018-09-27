/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../src/app');

describe('\'usr\' service', () => {
  it('registered the service', () => {
    const service = app.service('usr');

    assert.ok(service, 'Registered the service');
  });
  xit("creates a user",()=>{
    const service = app.service('usr');
    return service.create({email: "habs",password:"secrett"}).then(ans=>{
        //console.log(ans)
    })
  })
  it("finds a user", ()=>{
    const service = app.service('usr');
   return service.find({query: {email:"habs"}}).then(ans=>{
     //console.log(ans)
   })
  })
  it("creates a token",()=>{
    const service=app.service('authentication')
    assert.ok(service,"authentication registered")
    return service.create({user:"gerry",password:"secret"}).then(jwt=>{
      //console.log(jwt)
    })
  })
});
