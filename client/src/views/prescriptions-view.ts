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
  //fixmedi_comp: Element
  //reservemedi_comp: Element
  //symptomatic_comp: Element
  page_header: Element
  // c_ganz: Element
  c_header: Element
  total
  part
  client

  actPatientChanged(newValue, oldValue) {
    if (newValue && ((!oldValue) || (newValue.id !== oldValue.id))) {
      this.searchexpr = ""
      this.refresh(newValue.id)
    }
  }

  constructor(private pm: PrescriptionManager, private ea: EventAggregator) {
  }

  attached() {
    this.total = (window.innerHeight - this.page_header.getBoundingClientRect().height) * .9
    this.part = this.total / 3 - 10
    this.client = this.part - this.c_header.getBoundingClientRect().height - 20
  }
  refresh(id) {
    this.pm.fetchCurrent(id).then(result => {
      this.fixmedi = result.fix
      this.reservemedi = result.reserve
      this.symptommedi = result.symptom
      this.rezepte = result.rezepte
    })
  }

  /*
  getLabel(medi) {
    let lbl = this.pm.getLabel(medi)
    return lbl
  }
  */
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
      this.pm.setMode(data, target).then(updated => {
        setTimeout(() => {
          this.refresh(this.actPatient.id)
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
