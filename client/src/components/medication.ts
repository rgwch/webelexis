import { BindingSignaler } from 'aurelia-templating-resources';
import { bindable, autoinject } from "aurelia-framework";
import { PrescriptionManager, PrescriptionType } from "models/prescription-model";

@autoinject
export class Medication {
  @bindable list: Array<PrescriptionType>
  @bindable type: string = ""
  dosisFocus: boolean = false
  numberFocus: boolean = false
  @bindable h = "6em"
  constructor(private pm: PrescriptionManager, private signaler: BindingSignaler) { }

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
    event.dataTransfer.setData("text", event.target.id)
    event.dataTransfer.setData("wlxobj", event.target)
    event.dataTransfer.setData("wlxorigin", this.type)
    console.log("drag: " + event.target.id)
    return true
  }

  expand(idx) {
    // console.log("expand "+idx)
    if (this.opened == idx) {
      this.opened = -1
    } else {
      this.opened = idx
      if (this.type == "rp") {
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
