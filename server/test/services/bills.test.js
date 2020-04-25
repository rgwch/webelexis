const assert = require('assert');
const app = require('../../src/app');

describe('\'bills\' service', () => {
  it('registered the service', () => {
    const service = app.service('bills');

    assert.ok(service, 'Registered the service');
  });
});
