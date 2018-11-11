const assert = require('assert');
const app = require('../../src/app');

describe('\'billable\' service', () => {
  it('registered the service', () => {
    const service = app.service('billable');

    assert.ok(service, 'Registered the service');
  });
});
