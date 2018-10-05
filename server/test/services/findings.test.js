const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'findings\' service', () => {
  it('registered the service', () => {
    const service = app.service('findings');

    assert.ok(service, 'Registered the service');
  });
});
