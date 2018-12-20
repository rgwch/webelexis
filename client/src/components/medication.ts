import { BindingSignaler } from 'aurelia-templating-resources';
import { bindable, autoinject } from "aurelia-framework";
import { PrescriptionManager, PrescriptionType } from "models/prescription-model";

@autoinject
export class Medication {
  @bindable obj: PrescriptionType
  @bindable type: string = ""
  expanded = false;
  dosisFocus: boolean = false
  numberFocus: boolean = false

  constructor(private pm: PrescriptionManager, private signaler: BindingSignaler) { }

  getLabel() {
    let lbl = ""
    const o = this.obj
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
    event.dataTransfer.setData("wlx",this.type)
    console.log("drag: " + event.target.id)
    return true
  }

  expand() {
    this.expanded = !this.expanded
    if (this.expanded) {
      if (this.type == "rp") {
        this.numberFocus = true
      } else {
        this.dosisFocus = true
      }
    }
  }
  save() {
    this.pm.save(this.obj).then(s => {
      this.signaler.signal('update')
    })
  }

  checkkey(event) {
    if (event.keyCode == 13) {
      this.expanded = false
    }
    return true
  }
}
