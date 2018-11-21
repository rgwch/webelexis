const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'solr\' service', () => {
  it('registered the service', () => {
    const service = app.service('solr');

    assert.ok(service, 'Registered the service');
  });
  it('stores a file', () => {
    const service = app.service('solr');
    const file = {
      contents: `file://${__dirname}/solr.test.js`
    }

    return service.create(file).then(created => {
      assert(created.statusCode==200)
    }).catch(err => {
      assert.fail(err)
    })
  })
});
