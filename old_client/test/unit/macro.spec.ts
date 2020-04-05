import  {Macroprocessor} from '../../src/services/macro'
import { Dummysource } from './dummysource';
import { WebelexisEvents } from './dummyevents';
import { EncounterType } from 'models/encounter-model';

describe("macros",()=>{
  let dataSource
  let eventSource
  beforeAll(()=>{
    dataSource=new Dummysource()
    eventSource=new WebelexisEvents()
  })
  it("resolves some patterns",()=>{
    const mp=new Macroprocessor(eventSource,undefined, undefined, undefined)
    const encounter:EncounterType={
      type: "konsultation",
      datum:"20181119",
      zeit:"09:00",
      mandantid: "007",
      fallid:"007",
      eintrag: {
        remark:"dummy",
        timestamp: new Date().toString()
      }
    }
    const bd=mp.process(encounter, "120/80")
    expect(bd).toBe("BD: 120/80")
  })
})
