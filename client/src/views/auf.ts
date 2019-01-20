import { CaseType } from './../models/case';
import { DateTime } from './../services/datetime';
import { WebelexisEvents } from './../webelexisevents';
import { id } from './../fhir/model/fhir';
import { PatientType } from './../models/patient';
import { State } from './../state';
import { connectTo } from 'aurelia-store';
import { autoinject } from "aurelia-framework";
import { DataSource, DataService } from "services/datasource";
import { pluck } from 'rxjs/operators';

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(pluck("patient") as any),
  }
})

export class AUF {
  private aufService: DataService
  protected actPatient
  protected elems = []

  constructor(private ds: DataSource, private we:WebelexisEvents, private dt:DateTime) {
    this.aufService = ds.getService('auf')
  }

  public actPatientChanged(newpat: PatientType, oldpat?: PatientType) {
    this.fetch(newpat)
  }
  protected async fetch(pat) {
    if (pat) {
      const aufs = await this.aufService.find({ query: { patientid: pat.id } })
      this.elems = aufs.data.sort((a,b)=>{
        const dd=b.datumvon.localeCompare(a.datumvon)
        if(dd==0){
          return b.DatumAUZ.localeCompare(a.DatumAUZ)
        }else{
          return dd
        }
      })
    }
  }

  protected newAUF() {
    const fall: CaseType=this.we.getSelectedItem('fall')
    const today=this.dt.DateToElexisDate(new Date())
    const auftemplate={
      patientid: this.actPatient.id,
      fallid: (fall ? fall.id : undefined),
      prozent: "0",
      datumvon: today,
      datumbis: today,
      Grund: (fall ? fall.grund : undefined ),
      AUFZusatz: "",
      BriefID: undefined,
      DatumAUZ: today
    }
    this.aufService.create(auftemplate).then(created=>{
      fetch(this.actPatient)
    })
  }
}
