const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'createpdf\' service', () => {
  it('registered the service', () => {
    const service = app.service('createpdf');

    assert.ok(service, 'Registered the service');
  });
});
