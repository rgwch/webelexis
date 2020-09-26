const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'tarmed\' service', () => {
  it('registered the service', () => {
    const service = app.service('tarmed');

    assert.ok(service, 'Registered the service');
  });
});
