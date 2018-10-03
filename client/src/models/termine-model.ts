import { TerminType } from './termine-model';
import { UserType } from './user';

/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { KontaktType, Kontakt } from './kontakt'
import * as moment from 'moment'
import { DataSource, DataService } from './../services/datasource';
import { autoinject } from 'aurelia-framework';
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

/**
 * An Elexis "Termin"
 */
export interface TerminType {
  id?: string,
  PatID?: string,
  Bereich?: string,
  Tag: string,
  Beginn: string,
  Dauer: string,
  Grund?: string,
  TerminTyp: string,
  TerminStatus: string,
  kontakt?: KontaktType

}

let agendaTypColors={}
let agendaStateColors={}
let agendaResources=[]

@autoinject
@connectTo(store=>store.state.pipe(pluck('usr')))
export class TerminManager {
  terminService: DataService
  terminTypes = []
  terminStates = []

  stateChanged(newUser,oldUser){
    if(newUser){
      this.loadDefaultsFor(newUser)
    }
  }

  constructor(private ds: DataSource) {
    this.terminService = ds.getService('termin')

  }

  async loadDefaultsFor(user:UserType){
    agendaResources=await this.terminService.get("resources")
    agendaTypColors=await this.terminService.get("typecolors",{query: {user: user.label}})
    agendaStateColors=await this.terminService.get("statecolors", {query:{user: user.label}})
    return true
  }

  getResources(){
    return agendaResources
  }

  getStates(){
    return agendaStateColors;
  }
  private createGap(act: TerminModel, length: number): TerminModel {
    const start = act.getEndTime()
    return new TerminModel({
      Tag: act.obj.Tag,
      Beginn: (start.hours() * 60 + start.minutes()).toString(),
      Dauer: length.toString(),
      TerminTyp: this.terminTypes[0],
      TerminStatus: this.terminStates[0]
    })
  }
  async fetchForDay(date: Date, resource: string): Promise<Array<TerminModel>> {
    const day = moment(date)
    if (this.terminTypes.length == 0) {
      this.terminTypes = await this.terminService.get("types")
    }
    if (this.terminStates.length == 0) {
      this.terminStates = await this.terminService.get("states")
    }
    const found = await this.terminService.find({ query: { Tag: day.format("YYYYMMDD"), Bereich: resource } })
    if (found.data && found.data.length > 0) {
      const ret = Array<TerminModel>()
      const first = new TerminModel(found.data[0])
      if (parseInt(first.obj.Beginn) !== 0) {
        ret.push(Object.assign({}, first.obj, {
          Beginn: "0",
          Dauer: first.obj.Beginn,
          TerminTyp: this.terminTypes[0],
          TerminStatus: this.terminStates[0]
        }))
      }
      for (let i = 0; i < found.data.length - 1; i++) {
        const act = new TerminModel(found.data[i])
        const next = new TerminModel(found.data[i + 1])
        ret.push(act)
        const t1 = act.getEndTime()
        const t2 = next.getStartTime()
        const diff = t1.diff(t2, 'minutes')
        if (diff > 2) {
          ret.push(this.createGap(act, diff))
        }
      }
      const last = new TerminModel(found.data[found.data.length - 1])
      const midnight = last.getEndTime().clone().hour(23).minute(59)
      if (last.getEndTime().isBefore(midnight)) {
        ret.push(this.createGap(last, last.getEndTime().diff(midnight, 'minutes')))
      }
      return ret;
    } else {
      return []
    }
  }
}

export class TerminModel {
  obj

  constructor(obj: TerminType) {
    this.obj = obj
  }
  public getKontakt = (): KontaktType => this.obj.kontakt || <KontaktType>{ Bezeichnung1: "-" }
  public getLabel = (): string => Kontakt.getLabel(this.getKontakt())

  public getTypColor(){
    let tc=agendaTypColors[this.obj.TerminType] || "aaaaaa"
    return "#"+tc
  }
  public getStateColor(){
    let ts=agendaStateColors[this.obj.TerminStatus] || "bbbbbb"
    return "#"+ts
  }

  public rawContents(){
    return JSON.stringify(this.obj,null,2)
  }
  public getStartTime(): moment.Moment {
    const day = moment(this.obj.Tag, "YYYMMDD")
    day.add(parseInt(this.obj.Beginn), 'minutes')
    return day
  }

  public getEndTime(): moment.Moment {
    const start = moment(this.getStartTime())
    start.add(parseInt(this.obj.Dauer), 'minutes')
    return start
  }



}
