const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'meta-article\' service', () => {
  it('registered the service', () => {
    const service = app.service('meta-article');

    assert.ok(service, 'Registered the service');
  });
});
