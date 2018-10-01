const assert = require('assert');
const app = require('../../src/app');

describe('\'findings\' service', () => {
  it('registered the service', () => {
    const service = app.service('findings');

    assert.ok(service, 'Registered the service');
  });
});
