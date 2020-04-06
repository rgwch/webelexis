import { IKontakt, KontaktManager } from './../models/kontakt-model';
import { autoinject } from 'aurelia-framework';
import { EventManager, IEvent } from './../models/event-model';
import { DateTime } from '../services/datetime';
import * as moment from "moment";
import { connectTo } from 'aurelia-store'
import { State, appState } from '../services/app-state'
import { pluck } from 'rxjs/operators'


// @connectTo<State>(store => store.state.pipe(pluck('check')))
@connectTo()
@autoinject
export class Agenda {
  message: string;
  info = "was"
  constructor(private evm: EventManager, private dt: DateTime, private km: KontaktManager) {
  }

  stateChanged(n, o) {
    if (n) {
      if (n.loggedInUser) {
        if (o) {
          if (o.loggedInUser) {
            if (n.loggedInUser.id == o.loggedInUser.id) {
              return
            }
          }
        }
        this.evm.setUser(n.loggedInUser)
        console.log("user changed " + n.loggedInUser.id)
      }
    }
  }

  eventSelected = (event, instance) => {
    this.info = JSON.stringify(event.event)
  }
  setMonth = async (event, cal) => {
    const von = this.dt.DateToElexisDate(event.firstDay)
    const bis = this.dt.DateToElexisDate(moment(event.firstDay).add(35, 'days').toDate())
    cal.setEvents([])
    let skip = 0
    do {
      skip = await this.addBatch({ tag: { $gte: von, $lte: bis }, termintyp: {$ne: "Reserviert"}, bereich: "Gerry" }, skip, cal)
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
      return {
        start: this.dt.addMinutesToDate(ev.tag, ev.beginn),
        end: this.dt.addMinutesToDate(ev.tag, parseInt(ev.beginn) + parseInt(ev.dauer)),
        text: `${this.evm.getLabel(ev)} (${ev.termintyp},${ev.terminstatus}); ${ev.grund}`,
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
