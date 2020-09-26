const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'meta-article\' service', () => {
  it('registered the service', () => {
    const service = app.service('meta-article');

    assert.ok(service, 'Registered the service');
  });
});
