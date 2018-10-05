const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'prescriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('rezept');

    assert.ok(service, 'Registered the service');
  });
});
