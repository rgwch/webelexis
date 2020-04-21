import { IKontakt, KontaktManager } from './../models/kontakt-model';
import { autoinject, observable } from 'aurelia-framework';
import { EventManager, IEvent } from './../models/event-model';
import { DateTime } from '../services/datetime';
import * as moment from "moment";
import { AppState } from '../services/app-state'


@autoinject
export class Agenda {
  message: string;
  selectedEvent: IEvent

  constructor(private evm: EventManager, private dt: DateTime, private km: KontaktManager,
    private appState: AppState) {

  }


  eventSelected = (event, instance) => {
    this.selectedEvent = event.event
  }
  setMonth = async (event, cal) => {
    await this.evm.setUser()
    const dat = moment(event.firstDay).startOf('month').subtract(3, 'days')
    const von = this.dt.dateToElexisDate(dat.toDate())
    const bis = this.dt.dateToElexisDate(dat.add(36, 'days').toDate())
    cal.setEvents([])
    let skip = 0
    do {
      skip = await this.addBatch({ tag: { $gte: von, $lte: bis }, termintyp: { $ne: "Reserviert" }, bereich: "Gerry" }, skip, cal)
    } while (skip)

  }
  setDay = (event, cal) => {
    // alert(JSON.stringify(event))
    /*
    const datum = this.dt.DateToElexisDate(event.date)
    this.evm.find({ tag: datum }).then(events => {
      cal.setEvents(events.data.map((ev: IEvent) => {
        return {
          start: this.dt.addMinutesToDate(event.date, ev.beginn),
          end: this.dt.addMinutesToDate(event.date, parseInt(ev.beginn) + parseInt(ev.dauer)),
          text: this.evm.getLabel(ev)
        }
      }))
    })
    */
    return true
  }
  async addBatch(query, skip, cal): Promise<number> {
    query.$skip = skip
    const events = await this.evm.find(query)
    cal.addEvent(events.data.map((ev: IEvent) => {
      const label = this.evm.getLabel(ev)
      const typecolor = this.evm.getTypeColor(ev)
      const statecolor = this.evm.getStateColor(ev)
      return {
        start: this.dt.addMinutesToDate(ev.tag, ev.beginn),
        end: this.dt.addMinutesToDate(ev.tag, parseInt(ev.beginn) + parseInt(ev.dauer)),
        text: `${label} (<span style="color:${typecolor}">${ev.termintyp}</span>,<span style="color:${statecolor}">${ev.terminstatus}</span>); ${ev.grund || ""}`,
        color: this.evm.getStateColor(ev),
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
