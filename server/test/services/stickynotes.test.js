const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'stickynotes\' service', () => {
  const service = app.service('stickynotes');

  it('registered the service', () => {

    assert.ok(service, 'Registered the service');
  });

  it('loads Stickers',async ()=>{
    const all=await service.find()
    assert.ok(all)
    assert.ok(all.data)
  })
});
