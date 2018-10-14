import  {Macroprocessor} from '../../src/user/macro'
import { Dummysource } from './dummysource';
import { WebelexisEvents } from './dummyevents';

describe("macros",()=>{
  let dataSource
  let eventSource
  beforeAll(()=>{
    dataSource=new Dummysource()
    eventSource=new WebelexisEvents()
  })
  it("resolves some patterns",()=>{
    const mp=new Macroprocessor(dataSource,eventSource)
    const bd=mp.process("encounter", "120/80")
    expect(bd).toBe("Blut")
  })
})
