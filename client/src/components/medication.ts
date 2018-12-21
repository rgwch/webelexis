import { DataService } from 'services/datasource';
import { BindingSignaler } from 'aurelia-templating-resources';
import { bindable, autoinject } from "aurelia-framework";
import { PrescriptionManager, PrescriptionType, Modalities } from "models/prescription-model";
import { EventAggregator } from 'aurelia-event-aggregator';

const TRANSFER_MESSAGE = "took_prescription"
@autoinject
export class Medication {
  @bindable list: Array<PrescriptionType>
  @bindable modality: string = ""
  dosisFocus: boolean = false
  numberFocus: boolean = false
  @bindable h = "6em"
  constructor(private pm: PrescriptionManager, private signaler: BindingSignaler, private ea: EventAggregator) {
    this.ea.subscribe(TRANSFER_MESSAGE, (presc: PrescriptionType) => {
      const idx = this.list.findIndex(el => el.id == presc.id)
      if (idx != -1) {
        this.list = this.list.splice(idx, 1)
      }
    })
  }

  opened = -1

  attached() {
    console.log("attached")
  }

  getLabel(obj) {
    let lbl = ""
    const o = obj
    if (o) {
      if (o.ANZAHL) {
        lbl += o.ANZAHL.toString() + " "
      }
      if (o.Artikel && o.Artikel["DSCR"]) {
        lbl += o.Artikel["DSCR"]
      } else {
        lbl += "?"
      }
      if (o.Dosis) {
        lbl += " " + o.Dosis
      }
      if (o.Bemerkung) {
        lbl += " (" + o.Bemerkung + ")"
      }
    }
    return lbl
  }

  drag(event) {
    const obj=this.list.find(el=>event.target.id.endsWith(el.id))
    event.dataTransfer.setData("text/plain", event.target.id)
    event.dataTransfer.setData("webelexis/object", JSON.stringify(obj))
    event.dataTransfer.setData("webelexis/modality", this.modality)
    // console.log("drag: " + event.target.id)
    return true
  }

  dragOver(event) {
    if (event.dataTransfer.types.find(el => el.startsWith("webelexis"))) {
      event.preventDefault()
    }
    return true;
  }

  dragDrop(event) {
    event.preventDefault()
    const obj: PrescriptionType = JSON.parse(event.dataTransfer.getData("webelexis/object"))
    const mod = event.dataTransfer.getData("webelexis/modality")
    console.log("drop: " + obj + ", " + mod)
    obj.prescType = mod
    this.list.push(obj)
    this.pm.save(obj).then(result => {
      this.ea.publish(TRANSFER_MESSAGE, obj)
    })

  }

  expand(idx) {
    // console.log("expand "+idx)
    if (this.opened == idx) {
      this.opened = -1
    } else {
      this.opened = idx
      if (this.modality == "rp") {
        this.numberFocus = true
      } else {
        this.dosisFocus = true
      }
    }
    this.signaler.signal('expand')
  }
  save(obj) {
    this.pm.save(obj).then(s => {
      this.signaler.signal('update')
    })
  }

  checkkey(event) {
    if (event.keyCode == 13) {
      this.opened = -1
    }
    return true
  }
}