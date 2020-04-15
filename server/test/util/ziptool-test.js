const ziptool = require('../../src/util/ziptool')
const should = require('chai').should();


describe("Ziptool generates and reads Elexis CompEx conforming blobs", () => {
  const fakedata = "<?xml fake='true'>Lorem Ipsum dolorosum</xml>"

  it('passes self-check', () => {
    const result = ziptool.check(fakedata)
    fakedata.should.equal(result)
  })
  it("creates and reads an archive", async () => {
    const zipped = ziptool.create("test", fakedata)
    const extracted = ziptool.extract(zipped, "test")
    extracted.should.equal(fakedata)

  })
})
