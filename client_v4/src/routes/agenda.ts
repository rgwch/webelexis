/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { IQueryResult } from 'services/dataservice';
import { IKontakt, KontaktManager } from '../models/kontakt-manager';
import { autoinject, observable } from 'aurelia-framework';
import { EventManager, IEvent } from '../models/event-manager';
import { DateTime } from '../services/datetime';
import * as moment from "moment";
import { AppState } from '../services/app-state'


@autoinject
export class Agenda {
  message: string;
  selectedEvent: IEvent
  events: Array<IEvent> = []
  lastMonthEvent
  lastDayEvent
  lastResource: string

  constructor(private evm: EventManager, private dt: DateTime, private km: KontaktManager,
    private appState: AppState) {
  }

  private reload = object => this.setDay()
  attached() {
    this.evm.on(['created', 'removed', 'updated', 'patched'], this.reload)
  }
  detached() {
    this.evm.off(['created', 'removed', 'updated', 'patched'], this.reload)
  }

  /*
    the event-selcted from the calendar component
  */
  eventSelected = (event, instance) => {
    this.selectedEvent = event.event
  }
  /*
    the set-month callback from the calendar component
  */
  setMonth = async (ev, cal, resource?) => {
    await this.evm.setUser()
    if (ev) {
      this.lastMonthEvent = ev
    }
    const dat = moment((ev || this.lastMonthEvent).firstDay).startOf('month').subtract(3, 'days')
    const von = this.dt.dateToElexisDate(dat.toDate())
    const bis = this.dt.dateToElexisDate(dat.add(36, 'days').toDate())
    cal.setEvents([])

    if (resource) {
      this.lastResource = resource
    }
    let skip = 0
    do {
      skip = await this.addBatch({ tag: { $gte: von, $lte: bis }, termintyp: { $ne: "Reserviert" }, bereich: this.lastResource }, skip, cal)
    } while (skip)

  }

  /*
    the set-day callback from the calendar component
  */
  setDay = (event?, cal?, resource?) => {
    if (event) {
      this.lastDayEvent = event
    }
    if (resource) {
      this.lastResource = resource
    }

    const datum = this.dt.dateToElexisDate((event || this.lastDayEvent).date)
    this.evm.find({ tag: datum, bereich: this.lastResource }).then((list: IQueryResult<IEvent>) => {
      /*
      cal.setEvents(events.data.map((ev: IEvent) => {
        return {
          start: this.dt.addMinutesToDate(event.date, ev.beginn),
          end: this.dt.addMinutesToDate(event.date, parseInt(ev.beginn) + parseInt(ev.dauer)),
          text: this.evm.getLabel(ev)
        }
      }))
      */
      this.events = list.data
    })

    return true
  }

  async addBatch(query, skip, cal): Promise<number> {
    query.$skip = skip
    const events = await this.evm.find(query)
    cal.addEvent(events.data.map((ev: IEvent) => {
      const label = this.evm.getLabel(ev)
      // const typecolor = this.evm.getTypeColor(ev)
      // const statecolor = this.evm.getStateColor(ev)
      return {
        start: this.dt.addMinutesToDate(ev.tag, ev.beginn),
        end: this.dt.addMinutesToDate(ev.tag, parseInt(ev.beginn) + parseInt(ev.dauer)),
        text: label, //`${label} (<span style="color:${typecolor}">${ev.termintyp}</span>,<span style="color:${statecolor}">${ev.terminstatus}</span>); ${ev.grund || ""} <i class="fa fa.trash">`,
        // color: this.evm.getStateColor(ev),
        termin: ev
      }
    }))
    skip += events.limit
    if (skip >= events.total) {
      return 0
    }
    return skip
  }
}
