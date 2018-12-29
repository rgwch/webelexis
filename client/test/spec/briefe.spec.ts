import { DateTime } from 'services/datetime';
import { DataSource } from './../../src/services/datasource';
import { BriefManager, BriefType } from './../../src/models/briefe-model';
import { Dummysource } from './dummysource';
import { WebelexisEvents } from './dummyevents';
import { runInThisContext } from 'vm';

describe('briefe', () => {
  const ds=new Dummysource()
  const we=new WebelexisEvents()
  const dt=new DateTime(null)

  const bm: BriefManager=new BriefManager(ds,null,dt)
  it('merges a template and a brief with field resolvers', async () => {
    const brief: BriefType = {
      Betreff: "Test",
      _Patient: {
        ID: "007",
        Bezeichnung1: "Tausendwasser",
        Bezeichnung2: "Friedlich",
        geschlecht: "m",
        geburtsdatum: "19210401"
      },
      Datum: "20181229",
      typ: "Rezept",
      MimeType: "text/plain"
    }
    const template = `
      Datum: [Datum.heute]
      Patient: [Patient.bezeichnung1], [Patient.bezeichnung2]
      Er/Sie: [Patient:mw:Herr/Frau]
      XforU: [x]
    `
    const replacers = [{
      field: "x",
      replace: "u"
    }]

    const compiled=await bm.replaceFields(template,brief,replacers)
  })
})
