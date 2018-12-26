/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
/**
 * A Medication panel. There are several types of such panels, for corresponding medication modalities, such as
 * "fixmedikation" (continuous medication) "reservemedikation" (additional medication, "rezept" (prescription),
 * and past medications.
 * There are several rules involved when moving a medication from one paneltype to an other.
 */

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

  /**
   * Create a human readable label for a prescription
   * @param obj 
   */
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

  /**
   * create  visual feedback fpr possible drop zones when dragging a prescription or an article
   * @param mode 
   */
  mark(mode: boolean) {
    if (mode) {
      this.dropzone.style.border = "dashed 2px orange"
    } else {
      this.dropzone.style.border = "none"
    }
  }

  /**
   * user started a drag action -> create data to identify dragged object
   * @param event 
   */
  drag(event) {
    const obj = this.list.find(el => event.target.id.endsWith(el.id))
    event.dataTransfer.setData("text/plain", event.target.id)
    event.dataTransfer.setData("webelexis/object", JSON.stringify(obj))
    event.dataTransfer.setData("webelexis/modality", this.modality)
    event.dataTransfer.setData("webelexis/datatype", "prescriptions")
    return true
  }

  /**
   * user drags an object over us. We'll accept only if it is a "Webelexis" object.
   * @param event 
   */
  dragOver(event) {
    if (event.dataTransfer.types.find(el => el.startsWith("webelexis")) && this.list) {
      event.preventDefault()
      this.mark(true)
    }
    return true;
  }

  /**
   * drag/drop operation is finished or cancelled
   * @param event 
   */
  dragLeave(event) {
    this.mark(false)
  }

  /**
   * Add a prescription to our list
   * @param obj the prescription to add
   * @param fromModality the source modality
   */
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
  /**
   * User dropped an item (article or prescription) on us.
   * @param event 
   */
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

  /**
   * User selected an item. Open Edit fields for number, dose and remark
   * @param idx 
   */
  expand(idx) {
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
  /**
   * User left an editable field -> save corresponding prescription
   * @param obj 
   */
  save(obj) {
    this.pm.save(obj).then(s => {
      this.signaler.signal('update')
    })
  }

  /**
   * User pressed a key in an editable field. If it's CR: close field.
   * @param event 
   */
  checkkey(event) {
    if (event.keyCode == 13) {
      this.opened = -1

    }
    return true
  }
}
