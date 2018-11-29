const assert = require('assert');
const app = require('../../src/app');

describe('\'oddb\' service', () => {
  it('registered the service', () => {
    const service = app.service('oddb');

    assert.ok(service, 'Registered the service');
  });
});
