/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { KontaktType } from "./kontakt-model"
import type { ElexisType, UUID } from "./elexistype"
import type { UserType } from "./user-model"
import { DateTime } from "luxon"
// const log = LogManager.getLogger("findings-model")
import { getService } from "../services/io"

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

export class TerminManager {
  private terminService

  constructor() {
    this.terminService = getService("termin")
    this.loadDefaultsFor({ id: "gerry", roles: ["admin"] })
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
    const day = DateTime.fromJSDate(date)
    if (resource) {
      try {
        const found = await this.terminService.find({
          query: { tag: day.toFormat("yyyyLLdd"), bereich: resource }
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
          // this.router.navigateToRoute("user")
        } else {
          // log.error(err)
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
  public props = {
    open: false
  }
  private kontaktService

  constructor(obj: TerminType) {
    this.obj = obj
    this.kontaktService = getService("kontakt")
  }
  public getKontakt = async (): Promise<KontaktType> => {
    if (!this.obj.kontakt) {
      try {
        this.obj.kontakt = await this.kontaktService.get(this.obj.patid)
      } catch (err) {
        console.log(err)
      }
    }
    return this.obj.kontakt
  }
  public getLabel = async (): Promise<string> => {
    if (this.obj.termintyp === Statics.terminTypes[0]) {
      return Statics.terminTypes[0]
    } else if (this.obj.termintyp === Statics.terminTypes[1]) {
      return Statics.terminTypes[1]
    }
    else {
      let line;
      const k = await this.getKontakt()
      if (k) {
        line = kontaktManager.getLabel(k)
      } else {
        line = this.obj.patid
      }
      line += ` (${this.getTyp()}) - (${this.getState()})`
      return line;
    }
  }
  public getDescription = () => this.obj.grund
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

  public setStartTime(st: DateTime) {
    this.obj.tag = st.toFormat("yyyyLLdd")
    this.obj.beginn = (60 * st.hour + st.minute).toString()
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
  public getStartTime(): DateTime {
    const day = DateTime.fromFormat(this.obj.tag, "yyyyLLdd")
    day.plus({ minutes: parseInt(this.obj.beginn, 10) })
    return day
  }

  public getEndTime(): DateTime {
    const start = DateTime.local(this.getStartTime())
    start.plus({ minutes: parseInt(this.obj.dauer, 10) })
    return start
  }
}
