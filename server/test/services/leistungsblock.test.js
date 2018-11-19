const assert = require('assert');
const app = require('../../src/app');
const should = require('chai').should()

describe('\'leistungsblock\' service', () => {
  it('registered the service', () => {
    const service = app.service('leistungsblock');

    assert.ok(service, 'Registered the service');
  });

  it('loads the block kons15',async ()=>{
    const service = app.service('leistungsblock');
    const result=await service.find({query:{name: "Kons15"}})
    result.should.be.ok
    result.should.have.property("data")
    // result.data.should.be.an.Array
    const k15=result.data[0]
    k15.should.have.property("billables")
    k15.should.have.property("elemente")
    k15.should.not.have.property("leistungen")
    k15.should.not.have.property("codeelements")
    k15.billables.should.be.an('array')
    k15.elemente.should.be.an('array')
  })
});
