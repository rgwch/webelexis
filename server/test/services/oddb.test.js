const assert = require('assert');
const app = require('../../src/app');
const path=require('path')

describe('\'oddb\' service', () => {
  const service = app.service('oddb');

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('loads a new Artikelstamm',async ()=>{
    // const homedir=require('os').homedir()
    console.log(__dirname)
    const done=await service.update(path.join(__dirname,'../oddb_test.zip'),{})
    done.should.be.ok
  })
});
