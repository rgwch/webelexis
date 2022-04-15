import app from '../../app'

describe('Utility', () => {
  let service

  beforeAll(() => {
    service = app.service('utility')

  })
  afterAll(() => {
    delete app["knexClient"]
  })
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("packs and unpacks a string array", async () => {
    const arr = ["one", "two", "three"]
    const packed = await service.get("pack", arr)
    expect(packed).toBeTruthy()
    const expanded = await service.get("unpack", packed)
    expect(expanded).toEqual(arr)
  })

})
