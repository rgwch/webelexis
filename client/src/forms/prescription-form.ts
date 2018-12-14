import { WebelexisEvents } from './../webelexisevents';
import { DocManager, DocType } from './../models/document-model';
import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { DateTime } from '../services/datetime'
import { PrescriptionManager } from 'models/prescription-model';

@autoinject
export class PrescriptionForm {
  rpText = "Rezept"
  textArea

  constructor(private ea: EventAggregator,
    private we: WebelexisEvents,
    private dt: DateTime,
    private pm: PrescriptionManager) {
    this.ea.subscribe("rpPrinter", data => {
      this.rpText = data
    })
  }

  doPrint() {
    const actPatient = this.we.getSelectedItem('patient')

    const rp: DocType = {
      date: this.dt.DateToElexisDate(new Date()),
      concern: actPatient.id,
      contents: this.rpText,
      template: "rezept"
    }



  }

  drag(event) {
    event.preventDefault()
    return true
  }

  drop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData("text")
    const [datatype, dataid] = data.split("::")
    this.pm.fetch(data).then(presc => {
      const sel1 = this.textArea.selectionStart
      const sel2 = this.textArea.selectionEnd
      this.textArea.value = this.textArea.value.substring(0, sel1)
        + this.pm.getLabel(presc)
        + this.textArea.value.substring(sel2, this.textArea.value.length);
    })
  }
}
