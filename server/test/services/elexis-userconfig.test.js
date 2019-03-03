/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../src/app');
const chai=require('chai').use(require('chai-as-promised'))

describe('\'elexis-userconfig\' service', () => {
  let service
  beforeEach(()=>{
    service = app.service('elexis-userconfig');
  })
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  it('loads a configuration variable',()=>{
    return service.get("test:agenda/farben/typ/besuch").then(color=>{
      color.should.not.be.undefined
    })
  })
  it('returns the empty string on an inexistent configuration variable',()=>{
    return service.get("test:this/doesnt/exist").then(bad=>{
      bad.should.equal("")
    })
  })
  it('throws an error on inexistent user',()=>{
    return service.get("voldesort:agenda/farben/typ/besuch").should.be.rejected
  })
  it('finds a bunch of settings',()=>{
    return service.find({query: {user:"test",param:{$like:"agenda/farben/typ%"}}}).then(colors=>{
      (colors!=undefined).should.be.ok
    })
  })
});
