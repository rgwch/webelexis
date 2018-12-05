const assert = require('assert');
const app = require('../../src/app');

describe('\'meta-article\' service', () => {
  it('registered the service', () => {
    const service = app.service('meta-article');

    assert.ok(service, 'Registered the service');
  });
});
