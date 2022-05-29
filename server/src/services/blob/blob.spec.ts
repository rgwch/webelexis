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
    const blob: entity = { id, data: "Something" }
    const created = await service.create(blob)
    expect(id).toEqual(created.id)
    const check = await service.get(id)
    expect(check.data).toEqual(blob.data)

    const previous = await service.update(id, { id, data: "other" })
    expect(previous.data).toEqual(blob.data)

    const updated = await service.get(id)
    expect(updated.data).toEqual("other")
    const removed = await service.remove(id)
    expect(removed.data).toEqual(updated.data)
    // expect(async () => { await service.get(id) }).rejects.toThrow("Item not found")

  })

  it("creates an id if none given", async () => {
    const created = await service.create({ data: "A test" })
    expect(created.id).toBeTruthy()
    const got = await service.get(created.id)
    expect(got).toHaveProperty("id")
    expect(got.data).toEqual("A test")
    const removed = await service.remove(created.id)
    expect(removed.data).toEqual("A test")

  })
})
