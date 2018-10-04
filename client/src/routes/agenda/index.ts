/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, observable } from 'aurelia-framework'
import * as moment from 'moment'
import { WebelexisEvents } from '../../webelexisevents'
import { connectTo } from 'aurelia-store'
import { State } from '../../state'
import { TerminManager,Statics } from './../../models/termine-model';
import { pluck } from "rxjs/operators";

@autoinject
@connectTo<State>({
  selector: {
    actUser: store => store.state.pipe(pluck("usr")),
    actDate: store => store.state.pipe(pluck("date"))
  }
})
export class Agenda {
  appointments = { data: [] }
  dateStandard: string = "2018-01-26"
  private dateSubscriber
  private actDate
  @observable bereich = ""
  private bereiche = []

  constructor(private ea: EventAggregator, private we: WebelexisEvents,
    private tm: TerminManager) {

  }

  actDateChanged(newDate, oldDate) {
    this.dateStandard = moment(newDate).format("YYYY-MM-DD")
    this.actDate = newDate
    this.setDay(newDate, this.bereich)

  }

  actUserChanged(newUser,oldUser){

  }

  bereichChanged(neu, alt) {
    this.setDay(this.actDate, neu)
  }
  attached() {
    this.dateSubscriber = this.ea.subscribe("datepicker", event => {
      this.we.setDate(event.newDate)
    })
    return this.tm.loadDefaultsFor(this.we.getSelectedItem('usr')).then(result=>{
      // console.log("agenda default loaded")
      this.bereiche=Statics.agendaResources
      this.bereich=this.bereiche[0]
    })
  }

  detached() {
    this.dateSubscriber.dispose()
  }

  async setDay(date, resource) {
    const day = moment(date)
    this.appointments.data = []
    const entries = await this.tm.fetchForDay(date, resource)
    this.appointments.data = entries
  }
}
