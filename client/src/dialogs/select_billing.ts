import { DataSource, DataService } from './../services/datasource';
import { DialogController } from 'aurelia-dialog';
import { autoinject, useView, PLATFORM, observable } from "aurelia-framework";
import { EncounterType } from 'models/encounter';

@autoinject
export class SelectBilling {
  billableService: DataService
  @observable position: string
  encounter: EncounterType
  billables = []
 
  activate(kons) {
    this.encounter = kons
  }
  positionChanged(newValue, oldValue) {
    this.billables = []
    this.billableService.find({ query: { find: this.position, encounter: this.encounter } }).then(result => {
        this.billables = result
    })
  }
  constructor(private dc: DialogController, private ds: DataSource) {
    this.billableService = ds.getService("billable")
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
