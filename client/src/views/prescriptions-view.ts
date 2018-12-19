import { BindingSignaler } from 'aurelia-templating-resources';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { State } from "state";
import { pluck } from "rxjs/operators";
import { PrescriptionManager } from "models/prescription-model";
import { BriefManager, BriefType } from 'models/briefe-model';
import { DateTime } from 'services/datetime';

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(<any>pluck('patient')),
  }
})
export class Prescriptions {
  searchexpr = ""
  private actPatient
  fixmedi = []
  reservemedi = []
  symptommedi = []
  rezepte = []
  rezept = []
  actrezept: string
  rezeptZusatz: string
  page_header: Element
  c_header: Element
  total
  part
  client


  actPatientChanged(newValue, oldValue) {
    if (newValue && ((!oldValue) || (newValue.id !== oldValue.id))) {
      this.searchexpr = ""
      this.actrezept = undefined
      this.rezept = []
      this.refresh(newValue.id).then(() => {
        this.signaler.signal('selected')
      })

    }
  }

  constructor(private pm: PrescriptionManager, private ea: EventAggregator,
    private signaler: BindingSignaler, private bm: BriefManager, private dt: DateTime) {
  }

  attached() {
    this.total = (window.innerHeight - this.page_header.getBoundingClientRect().height) * .9
    this.part = this.total / 3 - 10
    this.client = this.part - this.c_header.getBoundingClientRect().height - 20
  }

  refresh(id) {
    this.fixmedi = []
    this.symptommedi = []
    this.reservemedi = []
    // this.rezepte = []
    return this.pm.fetchCurrent(id).then(result => {
      this.fixmedi = result.fix
      this.reservemedi = result.reserve
      this.symptommedi = result.symptom.sort((a, b) => {
        if (a.Artikel && b.Artikel) {
          const aa = a.Artikel;
          const ba = b.Artikel;
          if (aa.DSCR && ba.DSCR) {
            return aa.DSCR.localeCompare(ba.DSCR)
          } else {
            return 0;

          }
        }
      })
      this.rezepte = result.rezepte.sort((a, b) => {
        return a[1].date.localeCompare(b[1].date) * -1
      })
    })
  }

  selectRezept(rp) {
    this.rezept = rp[1].prescriptions
    this.rezeptZusatz=rp[1].RpZusatz
    this.actrezept = rp[0]
    this.signaler.signal('selected')
  }

  createRezept() {
    this.pm.createRezept().then(raw => {
      const rp = [raw.id, {
        date: raw.datum,
        prescriptions: [],
        RpZusatz: raw.RpZusatz
      }]
      this.rezepte.unshift(rp)
      this.selectRezept(rp)
    }).catch(err => {
      console.log(err)
      alert("Konnte kein Rezept erstellen")
    })
  }

  toPdf() {
    let table = "<table>"
    for (const item of this.rezept) {
      const remark = item.Bemerkung ? ("<br />" + item.Bemerkung) : ""
      table += `<tr><td>${item.ANZAHL || ""}</td><td>${item.Artikel.DSCR}${remark}</td><td>${item.Dosis || ""}</td></tr>`
    }
    table+="</table>"
    const fields = [{ field: "liste", replace: table },{field: "zusatz", replace: this.rezeptZusatz}]
    const rp: BriefType = {
      Datum: this.dt.DateToElexisDate(new Date()),
      Betreff: "Rezept",
      typ: "Rezept",
      MimeType: "text/html",
      patientid: this.actPatient
    }
    this.bm.generate(rp, "rezept", fields).then(html => {
      const win = window.open("", "_new")
      if (!win) {
        alert("Bitte stellen Sie sicher, dass dieses Programm Popups öffnen darf")
      } else {
        win.document.write(html)
        win.print()
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
  /*
  drag(event) {
    event.dataTransfer.setData("text", event.target.id)
    return true
  }
*/
  dragOver(event) {
    event.preventDefault()
    return true;
  }

  dragDrop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData("text")
    console.log("drop: " + data)
    if (event.currentTarget && event.currentTarget.id) {
      let params: { mode?: string, rezeptid?: string } = {}
      params.mode = event.currentTarget.id.substring(5)
      if (params.mode == "rezept") {
        params.rezeptid = this.actrezept;
      }
      this.pm.setMode(data, params).then(updated => {
        setTimeout(() => {
          this.refresh(this.actPatient.id).then(() => {
            if (params.mode == 'rezept') {
              this.selectRezept(this.rezepte[0])
            }
          })
        }, 10)

      })
    }
    return true
  }
  dragTrash(event) {
    event.preventDefault()
    return true
  }
  dropTrash(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData("text")
    this.pm.delete(data).then(removed => {
      this.refresh(this.actPatient.id)
    })
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
  toView(item, sel) {
    if (sel == item[0]) {
      return "highlight-item"
    } else {
      return "compactlist"
    }
  }
}
