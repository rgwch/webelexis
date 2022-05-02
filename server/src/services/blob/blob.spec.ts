import app from '../../test/app'
import blob from './blob.service'
app.configure(blob)

describe('Blob',()=>{
  let service

  beforeAll(()=>{
    service=app.service("blob")
  })

  afterAll(()=>{
    delete app["knexClient"]
  })

  it('registered the service',()=>{
    expect(service).toBeTruthy()
  })

  it("stores, retrieves and deletes an entry",async ()=>{
    const blob="Something"
    await service.update("test",{blob})
    const check=await service.get("test")
    expect(check).toEqual(blob)
    await service.update("test",{blob:"other"})
    const updated=await service.get("test")
    expect(updated).toEqual("other")
    await service.remove("test")
    expect(await service.get("test")).toBeFalsy()
    
  })
})