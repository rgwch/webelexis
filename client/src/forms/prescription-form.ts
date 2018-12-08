import { WebelexisEvents } from './../webelexisevents';
import { Doc,DocType } from './../models/document';
import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { DateTime } from '../services/datetime'

@autoinject
export class PrescriptionForm {
  rpText = "Rezept"

  constructor(private ea: EventAggregator, private we: WebelexisEvents, private dt: DateTime) {
    this.ea.subscribe("rpPrinter", data => {
      this.rpText = data
    })
  }

  doPrint() {
    const actPatient = this.we.getSelectedItem('patient')

    const rp= new Doc ({
      date: this.dt.DateToElexisDate(new Date()),
      concern: actPatient.id,
      contents: this.rpText,
      template: "rezept"
    })

    

  }
}
