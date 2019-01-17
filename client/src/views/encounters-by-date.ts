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

  protected encounters: EncounterType[] = [];
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
  /*
  protected dateFromChanged(newValue: string){
    this.fetch()
  }

  protected dateUntilChanged(newValue: string){
    this.fetch()
  }
*/
  private fetch() {
    return this.em
      .fetchFor(this.dateFrom, this.dateUntil, "")
      .then(result => {
        this.encounters = result;
      })
      .catch(err => {
        alert(err);
      });
  }
}
