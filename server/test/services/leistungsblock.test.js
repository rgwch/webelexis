const assert = require('assert');
const app = require('../../dist/app');


xdescribe('\'leistungsblock\' service', () => {
  const service = app.service('leistungsblock');

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('loads the block kons20', async () => {
    const result = await service.find({ query: { name: "Kons20" } })
    result.should.be.ok
    result.should.have.property("data")
    // result.data.should.be.an.Array
    const k20 = result.data[0]
    k20.should.have.property("billables")
    k20.should.have.property("elemente")
    k20.should.not.have.property("leistungen")
    k20.should.not.have.property("codeelements")
    k20.billables.should.be.an('array')
    k20.elemente.should.be.an('array')
  })
  xit('applies the block kons20', async () => {
    const billableService=app.service('billable')
    const result = await service.find({ query: { name: "Kons20" } })
    const k20 = result.data[0]
    const work=[]
    for(const el of k20.elemente){
      work.push(billableService.get(el.system+"!"+el.code))
    }
    const billables=await Promise.all(work)
    const done=await billableService.create(billables.map(d=>{
      d.encounter_id="007"
      let b= {billable: d}
      return b
    }))
    done.should.be.an('array')
  })
});
