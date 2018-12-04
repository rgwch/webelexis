import { autoinject } from "aurelia-framework";
import { DataSource } from "services/datasource";
import { connectTo } from "aurelia-store";
import { State } from "state";
import { pluck } from "rxjs/operators";

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(<any>pluck('patient')),
  }
})
export class Prescriptions{
  searchexpr=""
  prescriptionService
  private actPatient
  fixmedi=[]

  actPatientChanged(newValue, oldValue) {
    if((!oldValue) || (newValue.id !== oldValue.id)){
      this.searchexpr = ""
      this.refresh(newValue.id)
    }
  }

  constructor(private ds:DataSource){
    this.prescriptionService=ds.getService('prescriptions')
  }   
  attached(){

  }
  refresh(id){
    this.prescriptionService.find({query:{current: id}}).then(result=>{
      this.fixmedi=result.data
    })
  }
}
