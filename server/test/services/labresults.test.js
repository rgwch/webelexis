const assert = require('assert');
const app = require('../../src/app');

describe('\'labresults\' service', () => {
  it('registered the service', () => {
    const service = app.service('labresults');

    assert.ok(service, 'Registered the service');
  });
});
