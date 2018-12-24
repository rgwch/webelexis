/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { BindingSignaler } from 'aurelia-templating-resources';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, LogManager } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { State } from "state";
import { pluck } from "rxjs/operators";
import { PrescriptionManager, Modalities, PrescriptionType, RezeptType, RpDef } from "models/prescription-model";
import { BriefManager, BriefType } from 'models/briefe-model';
import { DateTime } from 'services/datetime';
import { DocType, DocManager } from '../models/document-model'
import { PatientManager } from 'models/patient';
import { TRANSFER_MESSAGE } from '../components/medication'
import { ElexisType, UUID } from 'models/elexistype';
import { WebelexisEvents } from './../webelexisevents';
import { PatientType } from './../models/patient';

// import * as html2pdf from 'html2pdf.js'

const log = LogManager.getLogger('prescriptions-view')



@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(<any>pluck('patient')),
  }
})
export class Prescriptions {
  mod = Modalities
  trashstyle = "margin-left:20px"
  log
  searchexpr = ""
  private actPatient:PatientType
  fixmedi: Array<PrescriptionType> = new Array<PrescriptionType>()
  reservemedi: PrescriptionType[] = []
  symptommedi: PrescriptionType[] = []
  rpdefs: RpDef[] = []
  actrpd: RpDef = undefined
  rezeptZusatz: string
  page_header: Element
  c_header: Element
  total
  part
  client


  actPatientChanged(newValue, oldValue) {
    if (newValue && ((!oldValue) || (newValue.id !== oldValue.id))) {
      this.searchexpr = ""
      this.actrpd = undefined
      this.refresh(newValue.id).then(() => {
        this.signaler.signal('selected')
      })

    }
  }

  constructor(private pm: PrescriptionManager, private ea: EventAggregator,
    private signaler: BindingSignaler, private bm: BriefManager,
    private dt: DateTime, private dm: DocManager, private patm: PatientManager,
    private we: WebelexisEvents) {
  }

  attached() {
    this.total = (window.innerHeight - this.page_header.getBoundingClientRect().height) * .9
    this.part = this.total / 3 - 10
    this.client = this.part - this.c_header.getBoundingClientRect().height - 20
  }

  refresh(patid: UUID) {

    this.fixmedi = []
    this.symptommedi = []
    this.reservemedi = []
    this.rpdefs = []
    this.actrpd = undefined

    return this.pm.fetchCurrent(patid).then(result => {
      this.fixmedi = result.fix
      this.reservemedi = result.reserve
      const rest = result.symptom.sort((a, b) => {
        if (a._Artikel && b._Artikel) {
          const aa = a._Artikel;
          const ba = b._Artikel;
          if (aa.DSCR && ba.DSCR) {
            return aa.DSCR.localeCompare(ba.DSCR)
          } else {
            return 0;

          }
        }
      })
      let sign = rest[0]
      const compacted = []
      for (let i = 0; i < rest.length; i++) {
        const r = rest[i]
        if (r._Artikel && r._Artikel.DSCR) {
          if (r._Artikel.DSCR === sign._Artikel.DSCR) {
            if (r.DateFrom < sign.DateFrom) {
              sign.DateFrom = r.DateFrom
            }
            if (r.DateUntil > sign.DateUntil) {
              sign.DateUntil = r.DateUntil
            }
          } else {
            compacted.push(sign)
            sign = rest[i]
          }
        }
      }
      this.symptommedi = compacted
      this.rpdefs = result.rezeptdefs.sort((a:RpDef, b:RpDef) => {
        return a.rezept.datum.localeCompare(b.rezept.datum) * -1
      })
    })
  }

  selectRezept(rpd?: RpDef) {
    if (rpd) {
      rpd.rezept.type="rezepte"
      this.actrpd = rpd
      this.we.selectItem(rpd.rezept)
    }
    setTimeout(() => {
      this.signaler.signal('selected')
      this.signaler.signal('update')
    }, 100)
  }

  createRezept() {
    this.pm.createRezept().then((raw: RezeptType) => {
      const rpd: RpDef={
        rezept: raw,
        prescriptions: []
      }
      this.rpdefs.unshift(rpd)
      this.selectRezept(rpd)
      return rpd
    }).catch(err => {
      console.log(err)
      alert("Konnte kein Rezept erstellen")
    })
  }

  toPdf() {
    let table = "<table>"
    for (const item of this.actrpd.prescriptions) {
      const remark = item.Bemerkung ? ("<br />" + item.Bemerkung) : ""
      table += `<tr><td>${item.ANZAHL || ""}</td><td>${item._Artikel.DSCR}${remark}</td><td>${item.Dosis || ""}</td></tr>`
    }
    table += "</table>"
    const fields = [{ field: "liste", replace: table }, { field: "zusatz", replace: this.actrpd.rezept.RpZusatz }]
    const rp: BriefType = {
      Datum: this.dt.DateToElexisDate(new Date()),
      Betreff: "Rezept",
      typ: "Rezept",
      MimeType: "text/html",
      patientid: this.actPatient.id
    }
    this.bm.generate(rp, "rezept", fields).then(html => {
      const win = window.open("", "_new")
      if (!win) {
        alert("Bitte stellen Sie sicher, dass dieses Programm Popups öffnen darf")
      } else {
        win.document.write(html)
        win.print()
        /*
        const domdoc = win.document.body
        const worker=new html2pdf.Worker
        worker.from(domdoc).toPdf().thenExternal(rs=>{
          console.log(rs)
        })*/
        const wlxdoc: DocType = {
          date: rp.Datum,
          payload: html,
          category: "Ausgang",
          concern: this.patm.createConcern(this.actPatient),
          subject: "Rezept"
        }
        this.dm.store(wlxdoc).catch(err => {
          // alert("Fehler beim Speichern")
        })
      }
    })
  }

  findId(element) {
    if (element.id.startsWith("card_")) {
      return element.id.subString(5)
    }
    if (element.parentElement.id.startsWith("card_")) {
      return element.parentElement.id.substring(5)
    }
  }

  dragTrash(event) {
    event.preventDefault()
    this.trashstyle = "margin-left:18px;transform: scale(1.5);"
    return true
  }
  dragTrashEnter(event) {
    this.trashstyle = "margin-left:18px;color:red;"
  }
  dragTrashLeave(event) {
    this.trashstyle = "margin-left:20px;transform:scale(1.0)"
  }
  dropTrash(event) {
    event.preventDefault()
    this.trashstyle = "margin-left:20px;transform:scale(1.0)"

    const obj: PrescriptionType = JSON.parse(event.dataTransfer.getData("webelexis/object"))
    const mod = event.dataTransfer.getData("webelexis/modality")
    console.log("trash: " + obj + ", " + mod)
    if (mod == Modalities.FIXMEDI || mod == Modalities.RECIPE || mod == Modalities.RESERVE) {
      obj.prescType = Modalities.SYMPTOMATIC
      obj.DateUntil = this.dt.DateToElexisDate(new Date())
      this.pm.save(obj).then(result => {
        this.ea.publish(TRANSFER_MESSAGE, {
          obj, source: "trash"
        })
      })
    }
    this.refresh(this.actPatient.id)
  }
  makePrescription() {
    this.ea.publish("left_panel", "rezept")
    this.ea.publish("rpPrinter", "Hello, World")
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
export class selectionClassValueConverter {
  toView(item:RpDef, selected:RpDef) {
    if (selected && (selected.rezept.id == item.rezept.id)) {
      return "highlight-item"
    } else {
      return "compactlist"
    }
  }
}
