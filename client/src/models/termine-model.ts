/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { KontaktType, Kontakt } from "./kontakt"
import * as moment from "moment"
import { DataSource, DataService } from "./../services/datasource"
import { autoinject, LogManager } from "aurelia-framework"
import { connectTo } from "aurelia-store"
import { pluck } from "rxjs/operators"
import { DateTime } from "../services/datetime"
import { Router } from "aurelia-router"
import { UserType } from "./user-model"
import { ElexisType, UUID } from "./elexistype"
const log = LogManager.getLogger("findings-model")

/**
 * An Elexis "Termin"
 */
export interface TerminType extends ElexisType {
  id?: UUID
  patid?: UUID
  bereich?: string
  tag: string // YYYYMMDD
  beginn: string // minutes from 00:00
  dauer: string // minutes
  grund?: string
  termintyp: string
  terminstatus: string
  kontakt?: KontaktType
  erstelltvon: string
}

export class Statics {
  public static terminTypes: string[] = []
  public static terminStates = []
  public static terminTypColors = {}
  public static terminStateColors = {}
  public static agendaResources = []
}

@autoinject
@connectTo(store => store.state.pipe(pluck("user") as any))
export class TerminManager {
  private terminService: DataService

  constructor(private ds: DataSource, private dt: DateTime, private router: Router) {
    this.terminService = ds.getService("termin")
  }

  public stateChanged(newUser, oldUser) {
    if (newUser) {
      this.loadDefaultsFor(newUser)
    }
  }

  public async loadDefaultsFor(user: UserType) {
    Statics.agendaResources = await this.terminService.get("resources")
    Statics.terminTypColors = await this.terminService.get("typecolors", {
      query: { user: user.id }
    })
    Statics.terminStateColors = await this.terminService.get("statecolors", {
      query: { user: user.id }
    })
    Statics.terminTypes = await this.terminService.get("types")
    Statics.terminStates = await this.terminService.get("states")
    return true
  }

  public async save(t: TerminModel) {
    if (t.obj.termintyp !== Statics.terminTypes[0]) {
      if (t.obj.id) {
        return await this.terminService.update(t.obj.id, t.obj)
      } else {
        return await this.terminService.create(t.obj)
      }
    }
  }

  public async delete(t: TerminModel) {
    return await this.terminService.remove(t.obj.id)
  }

  public async getNext(t: TerminModel): Promise<TerminModel> {
    const found = await this.terminService.find({
      query: {
        Bereich: t.obj.bereich,
        Tag: t.obj.tag
      }
    })
    if (found.data && Array.isArray(found.data)) {
      const a = found.data
      for (let i = 0; i < a.length - 1; i++) {
        if (a[i].beginn === t.obj.beginn) {
          return new TerminModel(a[i + 1])
        }
      }
    }
    return undefined
  }
  public async fetchForDay(date: Date, resource: string): Promise<TerminModel[]> {
    const day = moment(date)
    if (resource) {
      try {
        const found = await this.terminService.find({
          query: { tag: day.format("YYYYMMDD"), bereich: resource }
        })
        if (found.data && found.data.length > 0) {
          const ret = []
          const template = found.data[0]
          for (let i = 0; i < found.data.length - 1; i++) {
            const first: TerminType = found.data[i]
            const second: TerminType = found.data[i + 1]
            const firstEnd = parseInt(first.beginn, 10) + parseInt(first.dauer, 10)
            const secondBegin = parseInt(second.beginn, 10)
            ret.push(first)
            if (secondBegin - firstEnd > 1) {
              const gap: TerminType = {
                beginn: firstEnd.toString(),
                bereich: template.bereich,
                dauer: (secondBegin - firstEnd).toString(),
                erstelltvon: first.erstelltvon,
                tag: template.tag,
                terminstatus: Statics.terminStates[0],
                termintyp: Statics.terminTypes[0]
              }
              ret.push(gap)
            }
            // ret.push(second)
          }
          ret.push(found.data[found.data.length - 1])
          return ret.map(r => new TerminModel(r))
        } else {
          return []
        }
      } catch (err) {
        if (err.code && err.code === 401) {
          this.router.navigateToRoute("user")
        } else {
          log.error(err)
        }
      }
    } else {
      return []
    }
  }
}

/**
 * Syntactic sugar around TerminType
 */
export class TerminModel {
  public obj: TerminType

  constructor(obj: TerminType) {
    this.obj = obj
  }
  public getKontakt = (): KontaktType =>
    this.obj.kontakt || ({ bezeichnung1: "-" } as KontaktType)
  public getLabel = (): string => Kontakt.getLabel(this.getKontakt())
  public getTyp = (): string => this.obj.termintyp
  public getState = (): string => this.obj.terminstatus
  public isReserved = (): boolean => this.obj.termintyp === Statics.terminTypes[1]
  public isFree = (): boolean => this.obj.termintyp === Statics.terminTypes[0]
  public isAppointment = (): boolean => !this.isFree() && !this.isReserved()
  public getBeginMinutes = (): number => parseInt(this.obj.beginn, 10)
  public getDuration = (): number => parseInt(this.obj.dauer, 10)
  public getEndMinutes = (): number => this.getBeginMinutes() + this.getDuration()

  public setTyp(typ: string): boolean {
    this.obj.termintyp = typ
    return true
  }

  public setStartTime(st: moment.Moment) {
    this.obj.tag = st.format("YYYYMMDD")
    this.obj.beginn = (60 * st.hours() + st.minutes()).toString()
  }

  public setDuration(d: number) {
    this.obj.dauer = d.toString()
  }
  public getTypColor(): string {
    const tc = Statics.terminTypColors[this.obj.termintyp] || "aaaaaa"
    return "#" + tc
  }
  public getStateColor(): string {
    let ts: string
    if (this.obj.termintyp === Statics.terminTypes[0]) {
      ts = Statics.terminTypColors[this.obj.termintyp]
    } else if (this.obj.termintyp === Statics.terminTypes[1]) {
      ts = Statics.terminTypColors[this.obj.termintyp]
    } else {
      ts = Statics.terminStateColors[this.obj.terminstatus] || "bbbbbb"
    }
    return "#" + ts
  }

  public rawContents() {
    return JSON.stringify(this.obj, null, 2)
  }
  public getStartTime(): moment.Moment {
    const day = moment(this.obj.tag, "YYYYMMDD")
    day.add(parseInt(this.obj.beginn, 10), "minutes")
    return day
  }

  public getEndTime(): moment.Moment {
    const start = moment(this.getStartTime())
    start.add(parseInt(this.obj.dauer, 10), "minutes")
    return start
  }
}
