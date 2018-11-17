/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'usr\' service', () => {
  it('registered the service', () => {
    const service = app.service('usr');

    assert.ok(service, 'Registered the service');
  });
  it("creates a user",async ()=>{
    const service = app.service('usr');
    const created=await service.create({email: "habs",label:"dummy", password:"secrett", dummy: true})
    created.should.be.ok
    await service.remove(created.email)
  })
  xit("finds a user", ()=>{
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
  it("creates a user matching an elexis user",async ()=>{
    const userService=app.service('users');
    const elexisusers=await userService.find();
    elexisusers.data.should.be.ok
    elexisusers.data.length.should.be.gt(0)
    const elexisuser=elexisusers.data[0]
    const usrService=app.service('usr')
    const created=await usrService.create({email: "somemail", dummy:true, label:"dummy",password:"something",elexisuser_id: elexisuser.id})
    created.should.be.ok
    const all=await usrService.find()
    const retrieved=await usrService.get("somemail")
    retrieved.should.be.ok
    retrieved.should.have.property('elexiskontakt')
    retrieved.elexiskontakt.should.have.property('kontakt')
    const removed = await usrService.remove('somemail')
    removed.should.be.ok
  })
});
