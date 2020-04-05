import { IKontakt, KontaktManager } from './../models/kontakt-model';
import { autoinject } from 'aurelia-framework';
import { EventManager, IEvent } from './../models/event-model';
import { DateTime } from '../services/datetime';

@autoinject
export class Agenda {
  message: string;

  constructor(private evm:EventManager, private dt:DateTime, private km: KontaktManager) {
  }

  setDay=(event, cal)=>{
    // alert(JSON.stringify(event))
    const datum=this.dt.DateToElexisDate(event.date)
    this.evm.find({tag:datum}).then(events=>{
      cal.setEvents(events.data.map((ev:IEvent)=>{
        return{
          start: this.dt.addMinutesToDate(event.date,ev.beginn),
          end: this.dt.addMinutesToDate(event.date,parseInt(ev.beginn)+parseInt(ev.dauer)),
          text: this.evm.getLabel(ev)
        }
      }))
    })
  }
}
