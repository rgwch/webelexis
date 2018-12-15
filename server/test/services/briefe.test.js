const assert = require('assert');
const app = require('../../src/app');
require('chai').should()

describe('\'briefe\' service', () => {
  let service = app.service('briefe');
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('creates and retrieves a letter',async ()=>{
    const brief={
      Betreff: "Test",
      Datum: "20181010",
      typ: "Allg.",
      Path: "webelexis-tests/dummy.txt",
      contents: "Dies ist ein Text"
    }
    const created=await service.create(brief)
    created.should.be.ok
    created.id.should.be.ok
    created.should.not.have.property('contents')
    const retrieved=await service.get(created.id)
    retrieved.should.be.ok
    retrieved.contents.should.equal("Dies ist ein Text")
  })
});
