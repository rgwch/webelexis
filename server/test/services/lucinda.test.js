const assert = require('assert');
const app = require('../../src/app');

describe('\'lucinda\' service', () => {
  it('registered the service', () => {
    const service = app.service('lucinda');

    assert.ok(service, 'Registered the service');
  });
});
