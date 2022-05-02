import app from '../../app'

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
    await service.remove("test")
    expect(await service.get("test")).toBeFalsy()
    
  })
})