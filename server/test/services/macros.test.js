const assert = require('assert');
const app = require('../../src/app');
const chai=require('chai')
const promised=require('chai-as-promised')
chai.use(promised)
chai.should()

const macroset={
  name: "_unittest",
  creator: "özelditz",
  allowed: ["users"],
  macros: {
    kons: "*S:*\n*O:*\n*B:*\n*P:*",
    gw:"Gewicht"
  }
}

/* xx */ xdescribe('\'macros\' service', () => {
  xit("avoids duplicates",()=>{
    const service=app.service('macros')

    return service.create(macroset).then(result=>{
      service.create(macroset).should.not.be.rejected
      service.remove(macroset).should.be.fulfilled
    })
  })
  it('registered the service', () => {
    const service = app.service('macros');

    assert.ok(service, 'Registered the service');
  });
  it("creates, fetches, updates and deletes a named macro set",async ()=>{
    const service=app.service('macros')

    const created=await service.create(macroset)
    created.should.be.ok
    try{
      const m2= await service.create(macroset)
      throw(new Error("failure"))
    }catch(err){
      console.log("eeee")
      // do nothing
    }
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
