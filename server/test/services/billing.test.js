/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const assert = require('assert');
const should=require('chai').should()
const app = require('../../src/app');

class KonsService{
  async get(id){
    return {
      fallid: "007"
    }
  }
}

class FallService{
  async get(id){
    return {
      extjson:{
        billing: "KVG"
      },
      gesetz: "KVG"
    }
  }
}
describe('\'billing\' service', () => {
  let ks;
  let fs;

  before(()=>{
    ks=app.service("konsultation")
    fs=app.service('fall')
    app.use("/konsultation", new KonsService())
    app.use("/fall", new FallService())
  })

  after(()=>{
    app.use("/konsultation",ks)
    app.use("/fall",fs)
  })
  it('registered the service', () => {
    const service = app.service('billing');

    assert.ok(service, 'Registered the service');
  });

  it('creates a billing from a tarmed billable',async ()=>{
    const service = app.service('billing');
    const tarmedService=app.service('tarmed')
    const tarmeds=await tarmedService.find({query:{code:'00.0010', Law:"KVG"}})
    tarmeds.should.be.ok
    tarmeds.should.have.property('data')
    tarmeds.data.length.should.be.gt(0)
    const tarmed=tarmeds.data[0]
    tarmed.uid=tarmed.id
    tarmed.type='ch.elexis.data.TarmedLeistung'
    tarmed.encounter_id="007"
    tarmed.count=1
    const billed=await service.create(tarmed)
    billed.should.be.ok
  })
});
