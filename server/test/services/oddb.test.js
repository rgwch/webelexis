const assert = require('assert');
const app = require('../../dist/app');
const path=require('path')

xdescribe('\'oddb\' service', () => {
  const service = app.service('oddb');

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('loads a new Artikelstamm',async ()=>{
    const homedir=require('os').homedir()
    // const done=await service.update(path.join(homedir,"oddb2xml.zip"),{})
    const done=await service.update(path.join(__dirname,'../oddb_test.zip'),{})
    done.should.be.ok
  }).timeout(100000)
});
