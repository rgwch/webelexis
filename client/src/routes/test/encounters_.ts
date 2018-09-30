import { DataSource,DataService } from './../../services/datasource';
import { WebelexisEvents } from './../../webelexisevents';
import { autoinject } from "aurelia-framework";

@autoinject
export class EncountersTest{
  patService
  constructor(private ds:DataSource, private we:WebelexisEvents){
    this.patService=ds.getService('patient')
    this.patService.find({query: {$find: "test"}}).then(found=>{
      const patient=found.data[0]
      patient.type="patient"
      this.we.selectItem(patient)
    })
  }
}
