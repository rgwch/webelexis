/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const assert = require('assert');
const should=require('chai').should()
const app = require('../../src/app');

xdescribe('\'billing\' service', () => {
  it('registered the service', () => {
    const service = app.service('billing');

    assert.ok(service, 'Registered the service');
  });

  it('creates a billing from a tarmed billable',async ()=>{
    const service = app.service('billing');
    const tarmedService=app.service('tarmed')
    const tarmeds=await tarmedService.find({query:{code:'00.0010'}})
    tarmeds.should.be.ok
    tarmeds.should.have.property('data')
    tarmeds.data.length.should.be.gt(0)
    const tarmed=tarmeds.data[0]
    tarmed.uid=tarmed.ID
    tarmed.type='tarmed'
    tarmed.encounter_id="007"
    tarmed.count=1
    const billed=await service.create(tarmed)
    billed.should.be.ok
  })
});
