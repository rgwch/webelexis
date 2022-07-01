import app from '../../test/app'
import lucinda from './lucinda.service'
app.configure(lucinda)

describe('Lucinda', () => {
  let service

  const pause = ms => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve(0) }, ms)
    })
  }
  beforeAll(() => {
    service = app.service("lucinda")
  })
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })


  afterAll(async () => {
    const retr = await service.find({ query: "handle:www_lucindaspec" })
    for (const f of retr.data) {
      if (f["id"]) {
        await service.remove(f["id"])
      }
    }
  })


  it("stores, retrieves and deletes document metadata", async () => {
    const doc = {
      id: "_lucindaspec_",
      contents: "This will not be stored but only indexed",
      type: "webelexis_entry",
      handle: "www_lucindaspec"
    }
    const stored = await service.create(doc)
    expect(stored).toEqual("indexed")
    await pause(500)
    const retr = await service.find({ query: "contents:stored" })
    expect(retr).toBeTruthy()
    expect(retr.total).toBeGreaterThan(0)
    // expect(retr.data[0].id).toEqual("_lucindaspec_")
    //const inex = await (service.find({ query: "contents:saved" }))
    //expect(inex.total).toEqual(0)
    const inex2 = await (service.find({ query: "type:webelexis*" }))
    expect(inex2.total).toBeGreaterThan(0)
    const del = await service.remove("_lucindaspec_")
    const got = await service.get("_lucindaspec_")
    expect(got).toBeFalsy()
  })

  xit("stores, retrieves and deletes document contents", async () => {
    const doc = {
      payload: Buffer.from("This will be stored and indexed").toString("base64"),
      metadata: {
        id: "_lucindaspec2_",
        type: "webelexis_entry",
        filepath: "tests/lucinda.txt",
        handle: "www_lucindaspec"
      }
    }
    const stored = await service.create(doc)
    expect(stored).toEqual("added")
    await pause(200)
    const retr = await service.find({ query: "contents:stored" })
    expect(retr).toBeTruthy()
    expect(retr.total).toBeGreaterThan(0)
    const inex = await (service.find({ query: "contents:saved" }))
    expect(inex.total).toEqual(0)
    const inex2 = await (service.find({ query: "type:webelexis*" }))
    expect(inex2.total).toBeGreaterThan(0)
    const id = inex2.data[0].id
    const fulldoc: Buffer = await service.get(id)
    expect(fulldoc).toBeTruthy()
    const contents = fulldoc.toString("utf-8")
    expect(contents).toEqual("This will be stored and indexed")
    const del = await service.remove(id)
    const got = await service.get(id)
    expect(got).toBeFalsy()
  })
})
