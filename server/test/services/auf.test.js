const assert = require('assert');
const app = require('../../src/app');

describe('\'auf\' service', () => {
  it('registered the service', () => {
    const service = app.service('auf');

    assert.ok(service, 'Registered the service');
  });
});
