import { logger } from '../../logger'
import { level, debug } from 'winston'
logger.transports[0].silent = true
logger.transports[0].level = 'error'
import app from '../../app'


describe('bills', () => {
  let service

  beforeAll(async () => {
    service = app.service('bills')

  })
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })
  it('fetches some bills', async () => {
    const result = await service.find({})
    expect(result.total).toBeGreaterThan(0)
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
