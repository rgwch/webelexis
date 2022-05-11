import app from '../../test/app'
import lucinda from './lucinda.service'
app.configure(lucinda)

describe('Lucinda', () => {
  let service

  beforeAll(() => {
    service = app.service("lucinda")
  })
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("stores, retrieves and deletes a document", async () => {
    const doc = {
      id: "_lucindaspec_",
      contents: "This will not be stored but only indexed",
      type: "webelexis_entry",
      handle: "www_lucindaspec"
    }
    const stored = await service.create(doc)
    expect(stored).toEqual("indexed")
    const retr = await service.find({ query: "contents:stored" })
    expect(retr).toBeTruthy()
    expect(retr.total).toBeGreaterThan(0)
    expect(retr.data[0].id).toEqual("_lucindaspec_")
    const inex = await (service.find({ query: "contents:saved" }))
    expect(inex.total).toEqual(0)
    const inex2 = await (service.find({ query: "type:webelexis*" }))
    expect(inex2.total).toEqual(1)
    const del = await service.remove("_lucindaspec_")
    const got = await service.get("_lucindaspec_")
    expect(got).toBeFalsy()
  })

})
