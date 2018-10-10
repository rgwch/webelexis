/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, observable, computedFrom } from 'aurelia-framework'
import * as moment from 'moment'
import { WebelexisEvents } from '../../webelexisevents'
import { connectTo } from 'aurelia-store'
import { State } from '../../state'
import { TerminManager,Statics, TerminType } from './../../models/termine-model';
import { pluck } from "rxjs/operators";
import { Patient,PatientType } from "../../models/patient";
import { DataSource, DataService } from "services/datasource";

@autoinject
@connectTo<State>({
  selector: {
    actUser: store => store.state.pipe(<any>pluck("usr")),
    actDate: store => store.state.pipe(<any>pluck("date")),
    actPatient: store=> store.state.pipe(<any>pluck('patient'))
  }
})
export class Agenda {
  appointments = { data: [] }
  dateStandard: string = "2018-01-26"
  private dateSubscriber
  private actDate
  private actPatient:PatientType
  @observable bereich = ""
  private bereiche = []
  private terminService:DataService

  constructor(private ea: EventAggregator, private we: WebelexisEvents,
    private tm: TerminManager, private ds:DataSource) {
      this.terminService=ds.getService('termin')
      this.terminService.on('created',this.terminEvents)
      this.terminService.on('updated',this.terminEvents)
      this.terminService.on('removed',this.terminEvents)
   
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

  terminEvents=(obj:TerminType)=>{
    if(moment(obj.Tag).isSame(moment(this.actDate))){
      if(this.bereich===obj.Bereich){
        this.setDay(this.actDate,this.bereich)
      }
    }
  }

  async setDay(date, resource) {
    const day = moment(date)
    this.appointments.data = []
    const entries = await this.tm.fetchForDay(date, resource)
    this.appointments.data = entries
  }
}
