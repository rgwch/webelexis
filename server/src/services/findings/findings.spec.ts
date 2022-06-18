import app from '../../test/app'
import couch from '../couchdb/couchdb.service'
import finding from './findings.service'
import { entity } from './findings.class'
app.configure(couch)
app.configure(finding)

const sample: entity = {
  name: "Sample__",
  patientid: "007",
  measurements: [
    {
      datetime: "20220618080200",
      values: ["medium"]
    }
  ]
}
describe('Findings', () => {
  let service

  beforeAll(() => {
    service = app.service("findings")
  })


  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("stores,updates,retrieves and deletes a finding", async () => {
    const created=await service.create(sample)
    expect(created).toBeTruthy()
    const retrieved=await service.find({query:{name:"Sample__",patientid:"007"}})
    expect(retrieved).toBeTruthy()
    expect(retrieved.data).toBeTruthy()
    const m=retrieved.data[0]
    const removed=await service.remove(m.id)
    expect(removed.id).toEqual(m.id)
  })
})
