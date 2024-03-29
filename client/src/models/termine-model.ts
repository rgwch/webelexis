/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { KontaktType } from "./kontakt-model"
import type { ElexisType, UUID } from "./elexistype"
import type { UserType } from "./user-model"
import { DateTime } from "luxon"
// const log = LogManager.getLogger("findings-model")
import { getService } from "../services/io"
import { KontaktManager } from "./kontakt-model"
import type { PatientType } from "./patient-model"
import { currentUser, agendaResources, agendaResource } from "../services/store"

const kontaktManager = new KontaktManager()
const terminService = getService("termin")
let actUser: UserType;
/**
 * An Elexis "Termin"
 */
export interface TerminType extends ElexisType {
  id?: UUID
  patid?: UUID // or string, if not a patient
  bereich?: string
  tag: string // YYYYMMDD
  beginn: string // minutes from 00:00
  dauer: string // minutes
  grund?: string
  termintyp: string
  terminstatus: string
  kontakt?: KontaktType
  erstelltvon?: string
  angelegt?: string
}

export class Statics {
  public static terminTypes: string[] = []
  public static terminStates = []
  public static terminTypColors = {}
  public static terminStateColors = {}
}

currentUser.subscribe(async user => {
  actUser = user
  if (user && user.id) {
    terminService.get("resources").then(res => {
      agendaResources.set(res)
      agendaResource.set(res[0])
    })
    Statics.terminTypColors = await terminService.get("typecolors", {
      query: { user: user.id }
    })
    Statics.terminStateColors = await terminService.get("statecolors", {
      query: { user: user.id }
    })
    Statics.terminTypes = await terminService.get("types")
    Statics.terminStates = await terminService.get("states")
  }
})

export class TerminManager {


  public async save(t: TerminModel) {
    if (t.obj.termintyp !== Statics.terminTypes[0]) {
      if (t.obj.id) {
        return await terminService.update(t.obj.id, t.obj)
      } else {
        t.obj.erstelltvon = actUser.id
        const d = Math.round(new Date().getTime() / 60000)
        t.obj.angelegt = d.toString()
        return await terminService.create(t.obj)
      }
    }
  }

  public async delete(t: TerminModel) {
    return await terminService.remove(t.obj.id)
  }

  public async getNext(t: TerminModel): Promise<TerminModel> {
    const found = await terminService.find({
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
  public buildAppointmentList(raw: Array<TerminModel>) {
    const ret = []
    const template = raw[0]
    for (let i = 0; i < raw.length - 1; i++) {
      const first: TerminModel = raw[i]
      const second: TerminModel = raw[i + 1]
      const firstEnd = parseInt(first.obj.beginn, 10) + parseInt(first.obj.dauer, 10)
      const secondBegin = parseInt(second.obj.beginn, 10)
      ret.push(first)
      if (secondBegin - firstEnd > 1) {
        const gap: TerminType = {
          beginn: firstEnd.toString(),
          bereich: template.obj.bereich,
          dauer: (secondBegin - firstEnd).toString(),
          erstelltvon: first.obj.erstelltvon,
          tag: template.obj.tag,
          terminstatus: Statics.terminStates[0],
          termintyp: Statics.terminTypes[0]
        }
        ret.push(new TerminModel(gap))
      }
      // ret.push(second)
    }
    ret.push(raw[raw.length - 1])
    return ret
  }
  public async fetchForDay(date: Date, resource: string): Promise<TerminModel[]> {
    const day = DateTime.fromJSDate(date)
    if (resource) {
      try {
        const found = await terminService.find({
          query: { tag: day.toFormat("yyyyLLdd"), bereich: resource }
        })
        if (found.data && found.data.length > 0) {
          const ret = this.buildAppointmentList(found.data.map(a => new TerminModel(a)))
          return ret
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

  public getCreationTime(): Date {
    const ct = this.obj.angelegt
    if (ct) {
      const ms = parseInt(ct) * 60000
      return new Date(ms)
    } else {
      return new Date()
    }
  }
  public getDate(): Date {
    const dt = DateTime.fromFormat(this.obj.tag, "yyyyLLdd")
    return dt.toJSDate()
  }

  public setTyp(typ: string): boolean {
    this.obj.termintyp = typ
    return true
  }

  public setPatient(pat: PatientType) {
    this.obj.patid = pat.id
  }
  public setFreetext(text: string) {
    this.obj.patid = text
  }
  public setStatus(status: string): boolean {
    this.obj.terminstatus = status
    return true
  }
  public setBeginMinutes(m: number) {
    this.obj.beginn = m.toString()
  }
  public setStartTime(st: DateTime) {
    this.obj.tag = st.toFormat("yyyyLLdd")
    this.obj.beginn = (60 * st.hour + st.minute).toString()
  }

  public setDescription(text: string) {
    this.obj.grund = text
  }
  public setEndTime(et: DateTime) {
    const minutes = et.diff(this.getStartTime(), 'minutes')
    this.setDuration(minutes.as('minutes'))
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
    return day.plus({ minutes: parseInt(this.obj.beginn, 10) })
  }

  public getEndTime(): DateTime {
    const start = DateTime.fromFormat(this.obj.tag, "yyyyLLdd")
    return start.plus({ minutes: (parseInt(this.obj.beginn, 10) + parseInt(this.obj.dauer, 10)) })
  }
  public getTimeString() {
    const start = TerminModel.makeTime(parseInt(this.obj.beginn))
    const end = TerminModel.makeTime(parseInt(this.obj.beginn) + parseInt(this.obj.dauer))
    return start + "-" + end
  }
  public static makeTime(minutes: number): string {
    let hours = Math.floor(minutes / 60)
    let rest = minutes - (hours * 60)
    let mins = rest.toString()
    let hoursS = hours.toString()
    if (hoursS.length < 2) {
      hoursS = "0" + hours
    }
    if (mins.length < 2) {
      mins = "0" + mins
    }

    return hoursS + ":" + mins
  }


}
