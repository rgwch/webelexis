const assert = require('assert');
const app = require('../../src/app');

describe('\'solr\' service', () => {
  it('registered the service', () => {
    const service = app.service('solr');

    assert.ok(service, 'Registered the service');
  });
  it('stores a file',async ()=>{
    const service = app.service('solr');

    const created=service.create()
  })
});
