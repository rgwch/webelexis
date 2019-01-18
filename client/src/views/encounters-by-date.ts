import { PatientType } from './../models/patient';
import { CaseType } from './../models/case';
import { Patient } from 'models/patient';
import { autoinject, observable } from "aurelia-framework";
import { DataSource, DataService } from "services/datasource";
import * as moment from "moment";
import { EncounterType, EncounterManager } from "models/encounter-model";
import { EventAggregator } from "aurelia-event-aggregator";

@autoinject
export class EncountersByDate {
  protected enc;
  protected dateFrom = "2019-01-01";
  protected dateUntil = "2019-01-31";

  protected encounters: Array<{
    datetime: string
    fall: CaseType
    patient: PatientType
  }> = [];
  constructor(private em: EncounterManager, private ea: EventAggregator) {
    this.ea.subscribe(
      "ebd_from",
      (date: { newDate: string; oldDate: string }) => {
        this.dateFrom = moment(date.newDate).format("YYYY-MM-DD");
        this.fetch();
      }
    );
    this.ea.subscribe("ebd_until", date => {
      this.dateUntil = moment(date.newDate).format("YYYY-MM-DD");
      this.fetch();
    });
  }

  protected async patLabel(enc) {
    const pat = await this.em.getPatient(enc)
    return Patient.getLabel(pat)
  }
  private async fetch() {
    const raw = await this.em.fetchFor(this.dateFrom, this.dateUntil, "")
    const processed = []
    for (const encraw of raw) {
      const patient = await this.em.getPatient(encraw)
      const fall = await this.em.getCase(encraw)
      const encprocessed={
        datetime: encraw.datum,
        fall, patient
      }
      processed.push(encprocessed)
    }
    this.encounters = []
  }
}
