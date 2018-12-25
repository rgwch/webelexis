import { DateTime } from 'services/datetime';
import { WebelexisEvents } from '../webelexisevents';
import { DataService } from 'services/datasource';
import { BindingSignaler } from 'aurelia-templating-resources';
import { bindable, autoinject } from "aurelia-framework";
import { PrescriptionManager, PrescriptionType, Modalities, ArticleType } from "models/prescription-model";
import { EventAggregator } from 'aurelia-event-aggregator';
import './medication.scss'

export const REMOVE_MESSAGE = "remove_prescription"
export const ADD_MESSAGE = "add_prescription"
@autoinject
export class Medication {
  @bindable list: Array<PrescriptionType>
  @bindable modality: string = ""
  dosisFocus: boolean = false
  numberFocus: boolean = false
  dropzone: HTMLElement
  @bindable h = "6em"
  constructor(private pm: PrescriptionManager, private signaler: BindingSignaler,
    private ea: EventAggregator, private we: WebelexisEvents, private dt: DateTime) {
    this.ea.subscribe(REMOVE_MESSAGE, (msg) => {
      if (msg.source != this.modality && msg.origin == this.modality) {
        const presc: PrescriptionType = msg.obj
        if (this.list) {
          const idx = this.list.findIndex(el => el.id == presc.id)
          if (idx != -1) {
            this.list.splice(idx, 1)
          }
        }
      }
    })
    this.ea.subscribe(ADD_MESSAGE, msg => {
      if (this.modality == msg.dest) {
        this.addItem(msg.obj, msg.fromModality)
      }
    })
  }

  opened = -1

  getLabel(obj: PrescriptionType) {
    let lbl = ""
    const o = obj
    if (o) {
      if (o.ANZAHL) {
        lbl += o.ANZAHL.toString() + " "
      }
      if (o._Artikel && o._Artikel["DSCR"]) {
        lbl += o._Artikel["DSCR"]
      } else {
        lbl += "?"
      }
      if (o.Dosis) {
        lbl += " " + o.Dosis
      }
      if (o.Bemerkung) {
        lbl += " (" + o.Bemerkung + ")"
      }
      if (this.modality != Modalities.RECIPE) {
        if (o.DateFrom) {
          lbl += " [" + this.dt.ElexisDateToLocalDate(o.DateFrom)
          if (o.DateUntil) {
            if (o.DateUntil != o.DateFrom) {
              lbl += "-" + this.dt.ElexisDateToLocalDate(o.DateUntil)
            }
          }
          lbl += "]"
        }
      }
    }
    return lbl
  }

  mark(mode: boolean) {
    if (mode) {
      this.dropzone.style.border = "dashed 2px orange"
    } else {
      this.dropzone.style.border = "none"
    }
  }

  drag(event) {
    const obj = this.list.find(el => event.target.id.endsWith(el.id))
    event.dataTransfer.setData("text/plain", event.target.id)
    event.dataTransfer.setData("webelexis/object", JSON.stringify(obj))
    event.dataTransfer.setData("webelexis/modality", this.modality)
    event.dataTransfer.setData("webelexis/datatype", "prescriptions")
    return true
  }

  dragOver(event) {
    if (event.dataTransfer.types.find(el => el.startsWith("webelexis")) && this.list) {
      event.preventDefault()
      this.mark(true)
    }
    return true;
  }

  dragLeave(event) {
    this.mark(false)
  }

  addItem(obj: PrescriptionType, fromModality: string) {
    if (this.modality == Modalities.RECIPE) {
      let rezept = this.we.getSelectedItem('rezepte')
      obj._Rezept = rezept
      obj.REZEPTID = rezept.id
      if (!obj.ANZAHL) {
        obj.ANZAHL = "1"
      }
      this.pm.cloneAs(obj, Modalities.RECIPE).then(result => {
        this.list.push(obj)
      })
    } else {
      obj.prescType = this.modality
      this.pm.save(obj).then(result => {
        this.ea.publish(REMOVE_MESSAGE, { obj, source: this.modality, origin: fromModality })
        this.list.push(obj)
      })
    }
  }
  dragDrop(event) {
    event.preventDefault()
    this.mark(false)
    const datatype = event.dataTransfer.getData("webelexis/datatype")
    const json = event.dataTransfer.getData("webelexis/object")
    if (datatype == "article") {
      const obj: ArticleType = JSON.parse(json)
      this.pm.createFromArticle(obj).then(presc => {
        this.list.push(presc)
      })

    } else if (datatype == "prescriptions") {
      const obj: PrescriptionType = JSON.parse(json)
      const mod = event.dataTransfer.getData("webelexis/modality")
      if (mod != this.modality) {
        // console.log("drop: " + obj + ", " + mod)
        this.addItem(obj, mod)
      }
    }
  }

  expand(idx) {
    // console.log("expand "+idx)
    if (this.opened == idx) {
      this.opened = -1
    } else {
      this.opened = idx
      if (this.modality == Modalities.RECIPE) {
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
