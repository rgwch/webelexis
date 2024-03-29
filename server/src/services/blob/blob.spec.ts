/**
 * Make Sure, etcd server is running and reachable
 */

import app from '../../test/app'
import blob from './blob.service'
import couch from '../couchdb/couchdb.service'
import { entity } from './blob.class'
import lucinda from '../lucinda/lucinda.service'
app.configure(lucinda)
app.configure(couch)
app.configure(blob)

describe('Blob', () => {
  let service

  beforeAll(() => {
    service = app.service("blob")
  })


  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("stores, retrieves and deletes an entry", async () => {
    const id = "testblob"
    const blob: entity = { _id:id, data: "Something" }
    const created = await service.create(blob)
    expect(id).toEqual(created._id)
    const check = await service.get(id)
    expect(check.data).toEqual(blob.data)

    await service.update(id, { _id:id, data: "other" })
    
    const updated = await service.get(id)
    expect(updated.data).toEqual("other")
    const removed = await service.remove(id)
    expect(removed.data).toEqual(updated.data)
    // expect(async () => { await service.get(id) }).rejects.toThrow("Item not found")

  })

  it("creates an id if none given", async () => {
    const created = await service.create({ data: "A test" })
    expect(created._id).toBeTruthy()
    const got = await service.get(created._id)
    expect(got).toHaveProperty("_id")
    expect(got.data).toEqual("A test")
    const removed = await service.remove(created._id)
    expect(removed.data).toEqual("A test")

  })
  it("throws an error un undefined blob", async () => {
    try {
      const got = await service.get("thisIsInexistent")
      expect(false).toEqual(true)
    } catch (err) {
      expect(err.message).toEqual("not_found")
    }
  })
})
