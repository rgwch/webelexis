const app = require('../../dist/app');

xdescribe('\'invoice\' service', () => {
  it('registered the service', () => {
    const service = app.service('invoice');
    expect(service).toBeTruthy();
  });
});
