const assert = require('assert');
const app = require('../../src/app');
require('chai').should()

xdescribe('\'stickers\' service', () => {
  it('registered the service', () => {
    const service = app.service('stickers');

    assert.ok(service, 'Registered the service');
  });

  it("loads all stickers",async ()=>{
    const service = app.service('stickers');
    const stickers=await service.find()
    stickers.data.should.be.ok
    stickers.data.length.should.be.gt(0)
    stickers.data.forEach(sticker=>{
      //console.log(JSON.stringify(sticker))
      if(sticker.Name=='Hausarztmodell'){
        //const b=Buffer.from(sticker.imagedata)
        console.log(sticker.imagedata);
      }
    })
  })

  it("retrieves sticker ids for a patient",async ()=>{
    const patService=app.service('patient')
    const pats=await patService.find({query:{Bezeichnung1: "unittest"}})
    const pat=pats.data[0]
    const service = app.service('stickers');

    const stickers=await service.find({query:{forPatient:pat.id}})
    stickers.should.be.ok

  })
});
