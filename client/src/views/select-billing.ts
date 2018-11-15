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
  selected = []

  activate(kons) {
  }
  positionChanged(newValue, oldValue) {
    this.encounter = this.we.getSelectedItem("konsultation")
    this.billables = []
    this.billableService.find({ query: { find: this.position, encounter: this.encounter } }).then(result => {
      this.billables = result
    })
  }
  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.billableService = ds.getService("billable")
  }

  select(item) {
    this.selected.push(item)
  }
  deselect(item) {
    const idx = this.selected.indexOf(item)
    this.selected.splice(idx, 1)
  }
  getCode = elem => elem.code || elem.id.split(/-/)[0]
  getText = elem => elem.tx255 || elem.DSCR

  makeLabel(elem) {
    return this.getCode(elem) + " " + this.getText(elem)
  }

  drag(event) {
    console.log(event)
    event.dataTransfer.setData("text", event.target.id)
    return true
  }
}
