import { DataService } from './../../src/services/dataservice';
describe('check datasource', ()=>{
  it('should load a ds for IUser', async done =>{
    const ds=new DataService("user")
    const dummy=await ds.get("123")
    expect(dummy.id).toBe("123")
    console.log(dummy)
    done()
  })
})
