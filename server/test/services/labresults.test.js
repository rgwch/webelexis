const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'labresults\' service', () => {
  const labService = app.service('labresults');

  it('registered the service', () => {
    assert.ok(labService, 'Registered the service');
  });

  it('retrieves results from unittest', async () => {
    const patService = app.service('patient')
    const pats = await patService.find({ query: { titelsuffix: "unittest" } })
    if (pats.data.length > 0) {
      const pat = pats.data[0]
      const results = await labService.find({ query: { patientid: pat.id } })
      results.should.be.ok
    }
    // results.data.length.should.be.gt(0)
  })
  xit('skips 2 and limits to 10', async () => {
    const patService = app.service('patient')
    const pats = await patService.find({ query: { titelsuffix: "unittest" } })
    const pat = pats.data[0]
    const results = await labService.find({ query: { patientid: pat.id, $skip: 2, $limit: 10 } })
    results.should.be.ok
    results.data.length.should.equal(10)
    results.skip.should.equal(2)
  })
});
