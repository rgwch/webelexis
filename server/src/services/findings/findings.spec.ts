import app from '../../test/app'
import couch from '../couchdb/couchdb.service'
import finding from './findings.service'
import { entity } from './findings.class'
app.configure(couch)
app.configure(finding)

describe('Findings', () => {
  let service

  beforeAll(() => {
    service = app.service("findings")
  })


  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

})
