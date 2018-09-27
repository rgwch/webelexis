/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DataSource, DataService } from '../../services/datasource'
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from 'aurelia-framework'
import * as moment from 'moment'
import { WebelexisEvents } from '../../webelexisevents'
import { connectTo } from 'aurelia-store'
import { State } from '../../state'

@autoinject
@connectTo<State>(/*{
  selector: {
    actUser: store=>store.state.pipe(pluck("user")),
    actDate: store=>store.state.pipe(pluck("date"))
  }
}*/)
export class Agenda {
  appointments = { data: [] }
  dateStandard: string = "2018-01-26"
  private dateSubscriber
  private actDate

  constructor(private ea: EventAggregator, private we: WebelexisEvents, private ds: DataSource) { }

  stateChanged(now: State, before: State) {
    this.dateStandard = moment(now.date).format("YYYY-MM-DD")
    this.setDay(now.date, now.user)
  }
  attached() {
    this.dateSubscriber = this.ea.subscribe("datepicker", event => {
      //this.setDay(event.newDate,"gerry")
      this.we.setDate(event.newDate)
    })
    //this.setDay(this.dateStandard,"gerry")
  }

  detached() {
    this.dateSubscriber.dispose()
  }
  async setDay(date, resource) {
    const terminService = this.ds.getService('termin')
    let day = moment(date)
    this.appointments.data = []
    let entries = await terminService.find({ query: { tag: day.format("YYYYMMDD"), bereich: resource } })
    this.appointments = entries
  }
}
