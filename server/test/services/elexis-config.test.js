/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../src/app');
const chai=require('chai')
const should=chai.should()

xdescribe('\'elexis_config\' service', () => {
  it('registered the service', () => {
    const service = app.service('elexis-config');

    assert.ok(service, 'Registered the service');
  });
  it("loads a configuration variable",()=>{
    const service= app.service('elexis-config')
    return service.get('dbversion').then(ver=>{
      ver.startsWith("3.").should.be.ok
    })
  })
  it("parses config", ()=>{
    const service= app.service('elexis-config')
  
    return service.find({query:{
      param: {
        $like: '%version%'
      }
    }}).then(result=>{
      result.should.have.property("data")
      result.data.should.be.an.instanceof(Array)
      result.data.length.should.be.above(1)
    }) 
  })
});
