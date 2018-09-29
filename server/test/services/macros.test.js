const assert = require('assert');
const app = require('../../src/app');
const chai=require('chai')
const promised=require('chai-as-promised')
chai.use(promised)
const should=chai.should()


describe('\'macros\' service', () => {
  it('registered the service', () => {
    const service = app.service('macros');

    assert.ok(service, 'Registered the service');
  });
  it("creates, fetches, updates and deletes a named macro set",async ()=>{
    const service=app.service('macros')
    const macroset={
      name: "_unittest",
      creator: "özelditz",
      allowed: ["users"],
      macros: {
        kons: "*S:*\n*O:*\n*B:*\n*P:*",
        gw:"Gewicht"
      }
    }
    const created=await service.create(macroset)
    created.should.be.ok
    service.create(macroset).should.not.be.rejected
    const got=await service.get(macroset.name)
    got.should.be.ok
    //got.creator.should.equal("özelditz")
    const found=await service.find({query:{creator: "özelditz"}})
    found.should.be.ok
    found.should.have.property("data")
    found.data.length.should.be.gt(0)
    found.data[0].name.should.equal(macroset.name)
    const deleted=await service.remove(macroset.name)
    deleted.should.be.ok
    deleted.name.should.equal("_unittest")
  })
});
