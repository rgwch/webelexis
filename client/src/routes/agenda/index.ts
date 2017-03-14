/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import * as moment from 'moment'
import {BundleResult, FhirService} from '../../services/fhirservice'
import {Appointment, AppointmentFactory} from '../../models/appointment'
import {Schedule, ScheduleFactory} from '../../models/schedule'
import {Slot, SlotFactory} from '../../models/slot'
import {autoinject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {Config} from '../../config'

@autoinject
export class AgendaRoute {
  slots: BundleResult
  dateDisplay: string
  dateStandard: string = "2017-02-02"
  selectedActor: string
  private subscriber


  constructor(private appointmentFactory: AppointmentFactory, private slotFactory: SlotFactory, private scheduleFactory: ScheduleFactory,
              private fhirService: FhirService, private cfg: Config, private ea: EventAggregator) {
    this.subscriber = this.ea.subscribe("datepicker", event => {
      this.setDay(new Date(event.newDate), this.selectedActor)
    })
    this.ea.subscribe('agenda_reload', event => {
      this.setDay(new Date(this.dateStandard), this.selectedActor)
    })
  }

  setDay(date: Date, actor: string) {
    let day = moment(date)
    this.dateDisplay = day.format("dd, DD.MM.YYYY")
    this.dateStandard = day.format("YYYY-MM-DD")
    this.selectedActor = actor
    this.fhirService.filterBy(this.scheduleFactory, [
      {entity: "date", value: day.format("YYYY-MM-DD")},
      {entity: "actor", value: actor}
    ]).then(schedules => {
      if (schedules.status == "ok" && schedules.count > 0) {
        let schedule: Schedule = schedules.values[0]
        this.fhirService.filterBy(this.slotFactory, [{entity: "schedule", value: schedule.id}]).then(appnts => {
          let slots=[]
          let lastEnd="2000-01-01T00:00"
          appnts.values.forEach(appnt=>{
            let prev=moment(lastEnd).unix()
            let start=moment(appnt['start']).unix()
            if(prev<start){
              slots.push(this._makeFreeSlot(lastEnd,appnt['start']))
            }
            slots.push(appnt)
            lastEnd=appnt['end']
          })
          appnts.values=slots
          this.slots = appnts
        })
      }
    })
  }

  activate(params, routeConfig, instruction) {
    let date = params.date ? params.date : new Date()
    let actor = params.actor ? params.actor : this.cfg.general.actors[0].shortLabel
    this.setDay(date, actor)
  }

  private _makeFreeSlot(begin: string, end: string) {
    return new Slot({

      resourceType: "Slot",
      id          : this.fhirService.createUUID(),
      freeBusyType: "free",
      start       : begin,
      end         : end
    })
  }
  dumpSlot(slot) {
    return JSON.stringify(slot)
  }
}
