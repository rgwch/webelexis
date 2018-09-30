const assert = require('assert');
const app = require('../../src/app');

describe('\'labresults\' service', () => {
  it('registered the service', () => {
    const service = app.service('labresults');

    assert.ok(service, 'Registered the service');
  });

  it('retrieves results from unittest',()=>{
    const patService=app.service('patient')
    const pats=patService.find({query:{Bezeichnung1: "unittest"}})
    const pat=pats.data[0]
    const labService=app.service('labresults')
    const results=labService.find({query: {patientid: pat.id}})
  })
});
