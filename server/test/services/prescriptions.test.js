const assert = require('assert');
const app = require('../../src/app');

describe('\'prescriptions\' service', () => {
  const service = app.service('rezept');

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
});
