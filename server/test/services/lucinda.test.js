const assert = require('assert');
require('chai').should()
const app = require('../../src/app');

describe('\'lucinda\' service', () => {
  it('registered the service', () => {
    const service = app.service('lucinda');

    assert.ok(service, 'Registered the service');
  });

  it("tests server availability",async ()=>{
    const service = app.service('lucinda');
    const pong=await service.get("info")
    pong.should.be.a('string')
    pong.should.include('Lucinda')
  })
});
