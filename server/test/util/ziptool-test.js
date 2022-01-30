const ziptool = require('../../dist/util/ziptool')


xdescribe("Ziptool generates and reads Elexis CompEx conforming blobs", () => {
  const fakedata = "<?xml fake='true'>Lorem Ipsum dolorosum</xml>"

  it('passes self-check', async() => {
    const result = await ziptool.check(fakedata)
    fakedata.should.equal(result)
  })
  it("creates and reads an archive", async () => {
    const zipped = ziptool.create("test", fakedata)
    const extracted = await ziptool.extract(zipped, "test")
    extracted.should.equal(fakedata)

  })
})
