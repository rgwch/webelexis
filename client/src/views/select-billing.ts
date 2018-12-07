import { WebelexisEvents } from './../webelexisevents';
import { DataSource, DataService } from './../services/datasource';
import { autoinject, useView, PLATFORM, observable } from "aurelia-framework";
import { EncounterType } from 'models/encounter';
import { LeistungsblockManager } from 'models/leistungsblock-model';

@autoinject
export class SelectBilling {
  billableService: DataService
  blockService: DataService
  @observable ls_position: string
  encounter: EncounterType
  billables = []
  blocks = []
  selected = []

  activate(kons) {
    this.blockService.find().then(result => {
      this.blocks = result.data.map(d => { d.openState = false; return d; })
    })
  }

  ls_positionChanged(newValue, oldValue) {
    this.encounter = this.we.getSelectedItem("konsultation")
    if (!this.encounter) {
      alert("Damit die richtigen Positionen angezeigt werden, bitte eine Konsultation zum Verrechnen öffnen")
    } else {
      this.billables = []
      this.billableService.find({ query: { find: this.ls_position, encounter: this.encounter } }).then(result => {
        this.billables = result
      }).catch(err => {
        console.log(err)
      })
    }
  }

  constructor(private ds: DataSource, private we: WebelexisEvents, private bm: LeistungsblockManager) {
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
    //console.log(event)
    event.dataTransfer.setData("text", event.target.id)
    return true
  }

  changeState(block) {
    console.log(block.name)
    if (block.openState) {
      block.openState = false
    } else {
      this.bm.getElements(block).then(elements => {
        block.resolved = elements
        block.openState = true
      })
    }
  }
}
