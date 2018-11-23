const assert = require('assert');
const app = require('../../src/app');

describe('\'findings\' service', () => {
  const service = app.service('findings');

  it('registered the service', () => {
  
    assert.ok(service, 'Registered the service');
  });
});
