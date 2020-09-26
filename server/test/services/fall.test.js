/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const should=require('chai').should()
const app = require('../../src/app');

xdescribe('\'fall\' service', () => {
  let service;
  beforeEach(()=>{
    service=app.service('fall')
  })
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  xit("fetches all cases of first patient with first name or last name like 'test%'.",(done)=>{
    const patientService=app.service('patient')
    patientService.find({query:{$find: "test"}}).then(pats=>{
      pats.should.be.ok
      pats.data.should.not.be.empty
      const pat=pats.data[0]
      const id=pat.id
      id.should.be.a('string')
      service.find({query: {patientid: id}}).then (cases=>{
        cases.should.be.ok
        cases.data.should.not.be.empty
        cases.data.forEach(fall => {
          fall.patientid.should.equal(id)
        });
        done()
      })
    })
  })
  it("creates and deletes a fall",async ()=>{
    const fall={
      patientid:"007",
      bezeichnung: "unittest"
    }
    const created=await service.create(fall)
    created.id.should.be.ok
    created.should.have.property('lastupdate')
    //created.lastupdate.should.be.ok
    created.deleted.should.equal("0")
    const removed = await service.remove(created.id)
    removed.should.deep.equal(created)
  })
});
