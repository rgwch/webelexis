const assert = require('assert');
const app = require('../../src/app');

describe('\'leistungsblock\' service', () => {
  it('registered the service', () => {
    const service = app.service('leistungsblock');

    assert.ok(service, 'Registered the service');
  });
});
