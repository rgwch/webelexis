import { WebelexisEvents } from './../webelexisevents';
import { DataSource, DataService } from './../services/datasource';
import { autoinject, useView, PLATFORM, observable } from "aurelia-framework";
import { EncounterType } from 'models/encounter';

@autoinject
export class SelectBilling {
  billableService: DataService
  @observable position: string
  encounter: EncounterType
  billables = []
  selected=[]
 
  activate(kons) {
    this.encounter = this.we.getSelectedItem("konsultation")
  }
  positionChanged(newValue, oldValue) {
    this.billables = []
    this.billableService.find({ query: { find: this.position, encounter: this.encounter } }).then(result => {
        this.billables = result
    })
  }
  constructor(private ds: DataSource, private we:WebelexisEvents) {
    this.billableService = ds.getService("billable")
  }

  select(item){
    this.selected.push(item)
  }
  deselect(item){
    const idx=this.selected.indexOf(item)
    this.selected.splice(idx,1)
  }
  makeLabel(elem) {
    const code = elem.code || elem.id.split(/-/)[0]
    if (elem.tx255) {
      return code + " " + elem.tx255
    } else {
      return code + " " + elem.DSCR
    }
  }

}
