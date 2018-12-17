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
import { DateTime } from '../services/datetime'
import { Router } from 'aurelia-router';
import { UserType } from './user';
import { ElexisType,UUID } from './elexistype';

/**
 * An Elexis "Termin"
 */
export interface TerminType extends ElexisType{
  id?: UUID,
  PatID?: UUID,
  Bereich?: string,
  Tag: string,
  Beginn: string,
  Dauer: string,
  Grund?: string,
  TerminTyp: string,
  TerminStatus: string,
  kontakt?: KontaktType,
  ErstelltVon: string

}

export class Statics {
  static terminTypes = []
  static terminStates = []
  static terminTypColors = {}
  static terminStateColors = {}
  static agendaResources = []
}

@autoinject
@connectTo(store => store.state.pipe(<any>pluck('usr')))
export class TerminManager {
  terminService: DataService

  stateChanged(newUser, oldUser) {
    if (newUser) {
      this.loadDefaultsFor(newUser)
    }
  }

  constructor(private ds: DataSource, private dt: DateTime, private router: Router) {
    this.terminService = ds.getService('termin')

  }

  async loadDefaultsFor(user: UserType) {
    Statics.agendaResources = await this.terminService.get("resources")
    Statics.terminTypColors = await this.terminService.get("typecolors", { query: { user: user.label } })
    Statics.terminStateColors = await this.terminService.get("statecolors", { query: { user: user.label } })
    Statics.terminTypes = await this.terminService.get("types")
    Statics.terminStates = await this.terminService.get("states")
    return true
  }

  async save(t: TerminModel) {
    if (t.obj.TerminTyp != Statics.terminTypes[0]) {
      if (t.obj.id) {
        return await this.terminService.update(t.obj.id, t.obj)
      } else {
        return await this.terminService.create(t.obj)
      }
    }
  }

  async delete(t: TerminModel) {
    return await this.terminService.remove(t.obj.id)
  }
  async getNext(t: TerminModel): Promise<TerminModel> {
    const found = await this.terminService.find({
      query: {
        Bereich: t.obj.Bereich,
        Tag: t.obj.Tag
      }
    })
    if (found.data && Array.isArray(found.data)) {
      const a = found.data
      for (let i = 0; i < a.length - 1; i++) {
        if (a[i].Beginn === t.obj.Beginn) {
          return new TerminModel(a[i + 1])
        }
      }
    }
    return undefined
  }
  async fetchForDay(date: Date, resource: string): Promise<Array<TerminModel>> {
    const day = moment(date)
    if (resource) {
      try {
        const found = await this.terminService.find({ query: { Tag: day.format("YYYYMMDD"), Bereich: resource } })
        if (found.data && found.data.length > 0) {
          const ret = []
          const template = found.data[0]
          for (let i = 0; i < found.data.length - 1; i++) {
            const first = found.data[i]
            const second = found.data[i + 1]
            const firstEnd = parseInt(first.Beginn) + parseInt(first.Dauer)
            const secondBegin = parseInt(second.Beginn)
            ret.push(first)
            if (secondBegin - firstEnd > 1) {
              const gap = {
                Tag: template.Tag,
                Bereich: template.Bereich,
                TerminTyp: Statics.terminTypes[0],
                TerminStatus: Statics.terminStates[0],
                Beginn: firstEnd.toString(),
                Dauer: (secondBegin - firstEnd).toString()
              }
              ret.push(gap)
            }
            //ret.push(second)
          }
          ret.push(found.data[found.data.length - 1])
          return ret.map(r => new TerminModel(r))
        } else {
          return []
        }
      } catch (err) {
        if (err.code && err.code == 401) {
          this.router.navigateToRoute('user')
        }
      }
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
  public getTyp = (): string => this.obj.TerminTyp
  public getState = (): string => this.obj.TerminStatus
  public isReserved = (): boolean => this.obj.TerminTyp == Statics.terminTypes[1]
  public isFree = (): boolean => this.obj.TerminTyp == Statics.terminTypes[0]
  public isAppointment = (): boolean => (!this.isFree()) && (!this.isReserved())
  public getBeginMinutes = (): number => parseInt(this.obj.Beginn)
  public getDuration = (): number => parseInt(this.obj.Dauer)
  public getEndMinutes = (): number => this.getBeginMinutes() + this.getDuration()


  public setTyp(typ: string): boolean {
    this.obj.TerminTyp = typ
    return true;
  }

  public setStartTime(st: moment.Moment) {
    this.obj.Tag = st.format("YYYYMMDD")
    this.obj.Beginn = (60 * st.hours() + st.minutes()).toString()
  }

  public setDuration(d: number) {
    this.obj.Dauer = d.toString()
  }
  public getTypColor(): string {
    let tc = Statics.terminTypColors[this.obj.TerminTyp] || "aaaaaa"
    return "#" + tc
  }
  public getStateColor(): string {
    let ts
    if (this.obj.TerminTyp === Statics.terminTypes[0]) {
      ts = Statics.terminTypColors[this.obj.TerminTyp]
    } else if (this.obj.TerminTyp === Statics.terminTypes[1]) {
      ts = Statics.terminTypColors[this.obj.TerminTyp]
    } else {
      ts = Statics.terminStateColors[this.obj.TerminStatus] || "bbbbbb"
    }
    return "#" + ts
  }

  public rawContents() {
    return JSON.stringify(this.obj, null, 2)
  }
  public getStartTime(): moment.Moment {
    const day = moment(this.obj.Tag, "YYYYMMDD")
    day.add(parseInt(this.obj.Beginn), 'minutes')
    return day
  }

  public getEndTime(): moment.Moment {
    const start = moment(this.getStartTime())
    start.add(parseInt(this.obj.Dauer), 'minutes')
    return start
  }
}
