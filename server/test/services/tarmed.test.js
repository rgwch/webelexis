const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'tarmed\' service', () => {
  it('registered the service', () => {
    const service = app.service('tarmed');

    assert.ok(service, 'Registered the service');
  });
});
