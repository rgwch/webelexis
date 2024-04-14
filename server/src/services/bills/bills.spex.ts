import { configure } from '../../launcher'


describe('bills', () => {
  let service, app

  beforeAll(async () => {
    app = await configure()
    service = app.service('bills')

  })
  afterAll(() => {
    delete app["knexClient"]
  })
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })
  it('fetches some bills', async () => {
    const result = await service.find({})
    expect(result.total).toBeGreaterThan(0)
    const bill = result.data[0]
    expect(bill).toHaveProperty("extjson")

  })
  xit('modifies bill tracemessages', async () => {
    jest.setTimeout(20000);
    const result = await service.find({})
    expect(result.total).toBeGreaterThan(0)
    const bill = result.data[0]
    expect(bill).toHaveProperty("extjson")
    const outputs = bill.extjson["_Ausgegeben"]
    expect(Array.isArray(outputs)).toBeTruthy()
    outputs.push("__Test__")
    bill.extjson["_Ausgegeben"] = outputs
    const saved = await service.update(bill.id, bill)
    // const check = await service.find({ query: { id: bill.id } })
    // expect(check.data[0]).toHaveProperty("extjson")
    const check = await service.get(bill.id)
    expect(check).toHaveProperty("extjson")
    const meta = check.extjson
    expect(meta).toHaveProperty("_Ausgegeben")
    expect(meta._Ausgegeben).toContain("__Test__")

  })
  it('fetches bills matching a patient', async () => {
    const result = await service.find({ query: { patientid: "testperson", rnstatus: '5' } })
    expect(result.total).toBeGreaterThan(0)
    const check = result.data[0]
    expect(check).toHaveProperty('fallid')
    expect(check).toHaveProperty('_Fall')
    expect(check).toHaveProperty('mandantid')
    expect(check).toHaveProperty('_Mandant')
    const fall = check["_Fall"]
    expect(fall).toHaveProperty("patientid")
    expect(fall).toHaveProperty("_Patient")
    expect(fall._Patient).toHaveProperty("bezeichnung1")
  })

  it("fetches bills matching a birthdate", async () => {
    const result = await service.find({ query: { patientid: "1961", rnstatus: '5' } })
    expect(result.total).toBeGreaterThan(0)
  })
})
