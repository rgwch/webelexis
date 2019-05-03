import { DateTime } from './../../src/services/datetime';
import { BriefManager, BriefType } from './../../src/models/briefe-model';
import { Dummysource } from './dummysource';
import { WebelexisEvents as dummywe} from './dummyevents';
import * as moment from 'moment'
import { DummyUserManager } from './dummyusermanager';
import { UserManager } from 'models/user-model';
import { WebelexisEvents } from 'webelexisevents';

describe('briefe', () => {
  let dt = new DateTime(null)
  let  we:any = new dummywe()
  let  um = new DummyUserManager() as UserManager
  let  bm = new BriefManager(we,dt,um)
  it('merges a template and a brief with field resolvers', async () => {
    const brief: BriefType = {
      betreff: "Test",
      _Patient: {
        id: "007",
        bezeichnung1: "Tausendwasser",
        bezeichnung2: "Friedlich",
        geschlecht: "m",
        geburtsdatum: "19210401"
      },
      datum: "20181229",
      typ: "Rezept",
      mimetype: "text/plain"
    }
    const now=moment().format("YYYYMMDD")
    const template = `
      Datum: [Datum.heute]
      Patient: [Patient.Bezeichnung1], [Patient.Bezeichnung2]
      Er/Sie: [Patient:mw:Herr/Frau]
      XforU: [x]
      Username: [Anwender.id]
      EAN: [Mandant.EAN]
    `

    const replacers = [{
      field: "x",
      replace: "u"
    }]

    const compiled=await bm.replaceFields(template,brief,replacers)
    console.log(compiled)
    expect(compiled).toBe(`
      Datum: ${now}
      Patient: Tausendwasser, Friedlich
      Er/Sie: Herr
      XforU: u
      Username: dummyuser
      EAN: 007
    `)
  })
})
