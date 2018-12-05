import { Z_FIXED } from 'zlib';
import { autoinject } from "aurelia-framework";
import { DataSource } from "services/datasource";
import { connectTo } from "aurelia-store";
import { State } from "state";
import { pluck } from "rxjs/operators";
import { PrescriptionManager } from "models/prescription-model";

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(<any>pluck('patient')),
  }
})
export class Prescriptions {
  searchexpr = ""
  private actPatient
  fixmedi = []
  reservemedi = []
  symptommedi = []

  actPatientChanged(newValue, oldValue) {
    if ((!oldValue) || (newValue.id !== oldValue.id)) {
      this.searchexpr = ""
      this.refresh(newValue.id)
    }
  }

  constructor(private pm: PrescriptionManager) {
  }

  refresh(id) {
    this.pm.fetchCurrent(id).then(result => {
      this.fixmedi = result.fix
      this.reservemedi = result.reserve
      this.symptommedi = result.symptom
    })
  }

  /*
  getLabel(medi) {
    let lbl = this.pm.getLabel(medi)
    return lbl
  }
  */
 findId(element){
   if(element.id.startsWith("card_")){
     return element.id.subString(5)
   }
   if(element.parentElement.id.startsWith("card_")){
      return element.parentElement.id.substring(5)
   }
 }
  drag(event) {
    event.dataTransfer.setData("text", event.target.id)
    return true
  }

  dragOver(event){
    event.preventDefault()
    return true;
  }

  dragDrop(event){
    event.preventDefault()
    const data=event.dataTransfer.getData("text")
    if(event.currentTarget && event.currentTarget.id){
      const target=event.currentTarget.id.substring(5)
      this.pm.setMode(data,target).then(updated=>{
        this.refresh(this.actPatient.id)
      })
    }
  }
}
