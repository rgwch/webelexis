const assert = require('assert');
const app = require('../../src/app');
require('chai').should()

describe('\'prescriptions\' service', () => {
  const service = app.service('prescriptions');

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  it('loads and updates current medication from unittest',async ()=>{
    const patService=app.service('patient')
    const list=await patService.find({query: {bezeichnung1:"unittest"}})
    const testperson=list.data[0]
    const medis=await service.find({query: {current: testperson.id}})
    medis.should.be.ok
    medis.data.length.should.be.gt(0)
    const medi=medis.data[0]
    const art=medi.Artikel || medi.artikelid
    art.should.be.a('string')
    medi._Artikel.should.be.an('object')
    medi._Artikel.id.should.equal(art)
    const updated=await service.update(medi.id,medi)
    updated.should.not.have.property('_Artikel')
    const art2=updated.Artikel || updated.artikelid
    art2.should.equal(art)
  })
});
