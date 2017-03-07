/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import * as moment from 'moment'
import {BundleResult, FhirService} from '../../services/fhirservice'
import {Appointment,AppointmentFactory} from '../../models/appointment'
import {Schedule,ScheduleFactory} from '../../models/schedule'
import {Slot,SlotFactory} from '../../models/slot'
import {autoinject} from 'aurelia-framework'

@autoinject
export class AgendaRoute{
  slots:BundleResult
  dateDisplay: string

  attached(){
    this.setDay(new Date("2016-11-23"))
  }
  constructor(private appointmentFactory:AppointmentFactory,private slotFactory:SlotFactory,private scheduleFactory:ScheduleFactory,
  private fhirService:FhirService){}

  setDay(date:Date){
    let day=moment(date)
    this.dateDisplay=day.format("dd, DD.MM.YYYY")
    this.fhirService.filterBy(this.scheduleFactory,"date",day.format("YYYY-MM-DD")).then(schedules=>{
      if(schedules.status=="ok" && schedules.count>0){
        let schedule:Schedule=schedules.values[0]
        this.fhirService.filterBy(this.slotFactory,"schedule",schedule.id).then(slots=>{
          this.slots=slots
        })
      }
    })
  }

  dumpSlot(slot){
    return JSON.stringify(slot)
  }
}