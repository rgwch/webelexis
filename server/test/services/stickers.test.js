const assert = require('assert');
const app = require('../../src/app');
require('chai').should()

describe('\'stickers\' service', () => {
  it('registered the service', () => {
    const service = app.service('stickers');

    assert.ok(service, 'Registered the service');
  });

  it("loads all stickers",async ()=>{
    const service = app.service('stickers');
    const stickers=await service.find()
    stickers.data.should.be.ok
    stickers.data.length.should.be.gt(0)
  })
});
