/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, observable} from "aurelia-framework";
import * as moment from "moment";
import { WebelexisEvents } from "../../webelexisevents";
import { connectTo } from "aurelia-store";
import { State } from "../../state";
import {
  TerminManager,
  Statics,
  TerminType
} from "./../../models/termine-model";
import { pluck } from "rxjs/operators";
import { Patient, PatientType } from "../../models/patient";
import { DataSource, DataService } from "services/datasource";
import { UserType } from "./../../models/user";
import "./agendastyles.scss";

@autoinject
@connectTo<State>({
  selector: {
    actDate: store => store.state.pipe(pluck("date") as any),
    actPatient: store => store.state.pipe(pluck("patient") as any),
    actUser: store => store.state.pipe(pluck("usr") as any)
  }
})
export class Agenda {
  protected appointments = { data: [] };
  protected dateStandard: string = "2018-01-26";
  @observable
  protected bereich = "";

  private dateSubscriber;
  private actDate;
  private actUser: UserType;
  private actPatient: PatientType;
  private bereiche: string[] = [];
  private terminService: DataService;

  constructor(
    private ea: EventAggregator,
    private we: WebelexisEvents,
    private tm: TerminManager,
    private ds: DataSource
  ) {
    this.terminService = ds.getService("termin");
    this.terminService.on("created", this.terminEvents);
    this.terminService.on("updated", this.terminEvents);
    this.terminService.on("removed", this.terminEvents);
  }

  public attached() {
    this.dateSubscriber = this.ea.subscribe("datepicker", event => {
      this.we.setDate(event.newDate);
    });
    return this.tm.loadDefaultsFor(this.actUser).then(result => {
      // console.log("agenda default loaded")
      this.bereiche = Statics.agendaResources;
      this.bereich = this.bereiche[0];
    });
  }

  public detached() {
    this.dateSubscriber.dispose();
  }

  public terminEvents = (obj: TerminType) => {
    if (moment(obj.Tag).isSame(moment(this.actDate))) {
      if (this.bereich === obj.Bereich) {
        this.setDay(this.actDate, this.bereich);
      }
    }
  };

  protected actDateChanged(newDate, oldDate) {
    this.dateStandard = moment(newDate).format("YYYY-MM-DD");
    this.actDate = newDate;
    this.setDay(newDate, this.bereich);
  }

  /**
   * fired if the user changes the "bereiche" Combobox
   * @param neu
   * @param alt
   */
  protected bereichChanged(neu: string /*, alt: string */) {
    this.setDay(this.actDate, neu);
  }

  private async setDay(date, resource) {
    const day = moment(date);
    this.appointments.data = [];
    const entries = await this.tm.fetchForDay(date, resource);
    this.appointments.data = entries;
  }
}
