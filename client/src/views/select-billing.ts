import { WebelexisEvents } from './../webelexisevents';
import { DataSource, DataService } from './../services/datasource';
import { autoinject, useView, PLATFORM, observable } from "aurelia-framework";
import { EncounterType } from 'models/encounter';

@autoinject
export class SelectBilling {
  billableService: DataService
  blockService: DataService
  @observable ls_position: string
  @observable bl_position: string
  encounter: EncounterType
  billables = []
  blocks = []
  selected = []

  activate(kons) {
    this.blockService.find().then(result=>{
      this.blocks=result.data
    })
  }

  ls_positionChanged(newValue, oldValue) {
    this.encounter = this.we.getSelectedItem("konsultation")
    this.billables = []
    this.billableService.find({ query: { find: this.ls_position, encounter: this.encounter } }).then(result => {
      this.billables = result
    })
  }
  bl_positionChanged(newValue, oldValue) {
    this.encounter = this.we.getSelectedItem("konsultation")
    this.blocks = []
    this.blockService.find({ query: { name: this.bl_position, encounter: this.encounter } }).then(result => {
      this.blocks = result.data
    })

  }
  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.billableService = ds.getService("billable")
    this.blockService = ds.getService('leistungsblock')
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
  getLabel = block => block.name || "??"

  makeLabel(elem) {
    return this.getCode(elem) + " " + this.getText(elem)
  }

  drag(event) {
    console.log(event)
    event.dataTransfer.setData("text", event.target.id)
    return true
  }
}
