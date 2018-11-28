const assert = require('assert');
const app = require('../../src/app');
require('chai').should()

describe('\'prescriptions\' service', () => {
  const service = app.service('prescriptions');

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  it('loads current medication from unittest',async ()=>{
    const patService=app.service('patient')
    const list=await patService.find({query: {bezeichnung1:"unittest"}})
    const testperson=list.data[0]
    const medis=await service.find({query: {current: testperson.id}})
    medis.should.be.ok
  })
});
