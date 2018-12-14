import { BindingSignaler } from 'aurelia-templating-resources';
import { ArtikelDetail } from './artikeldetail';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import { DataSource } from "services/datasource";
import { connectTo } from "aurelia-store";
import { State } from "state";
import { pluck } from "rxjs/operators";
import { PrescriptionManager } from "models/prescription-model";

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
  page_header: Element
  c_header: Element
  total
  part
  client


  actPatientChanged(newValue, oldValue) {
    if (newValue && ((!oldValue) || (newValue.id !== oldValue.id))) {
      this.searchexpr = ""
      this.actrezept=undefined
      this.rezept=[]
      this.refresh(newValue.id).then(()=>{
        this.signaler.signal('selected')
      })
      
    }
  }

  constructor(private pm: PrescriptionManager, private ea: EventAggregator,
    private signaler: BindingSignaler) {
  }

  attached() {
    this.total = (window.innerHeight - this.page_header.getBoundingClientRect().height) * .9
    this.part = this.total / 3 - 10
    this.client = this.part - this.c_header.getBoundingClientRect().height - 20
  }
  refresh(id) {
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
    this.actrezept = rp[0]
    this.signaler.signal('selected')
  }

  createRezept() {
    this.pm.createRezept().then(raw => {
      const rp = [raw.id, {
        date: raw.datum,
        prescriptions: []
      }]
      this.rezepte.unshift(rp)
      this.selectRezept(rp)
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
  drag(event) {
    event.dataTransfer.setData("text", event.target.id)
    return true
  }

  dragOver(event) {
    event.preventDefault()
    return true;
  }

  dragDrop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData("text")
    if (event.currentTarget && event.currentTarget.id) {
      const target = event.currentTarget.id.substring(5)
      const params: any = {}
      if (target == "rezept") {
        params.rezeptid = this.actrezept;
      }
      this.pm.setMode(data, target, params).then(updated => {
        setTimeout(() => {
          this.refresh(this.actPatient.id).then(()=>{
            if(target=='rezept'){
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
