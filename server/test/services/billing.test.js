const assert = require('assert');
const app = require('../../src/app');

describe('\'billing\' service', () => {
  it('registered the service', () => {
    const service = app.service('billing');

    assert.ok(service, 'Registered the service');
  });
});
