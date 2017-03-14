/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */


import {FhirObject} from "./fhirobject";
import {Refiner} from "./fhirsync";
import {FHIR_Appointment, FHIR_Resource, FHIR_Slot} from '../common/models/fhir'
import * as moment from "moment";
import {Appointment} from "./appointment";
// import * as config from 'nconf'


/**
 * To fetch busy and free slots from a given date:
 * - get a Schedule for that date (/Schedule?date=2017-03-02)
 * - get Slots for that Schedule (/Slot?schedule=${schedule.id}
 *
 * If a slot is "busy" then an Appointment with the same ID exists, and
 * that appointment is included as "contained" resource within the slot.
 *
 * So, this sequence is cheap: A Schedule does not require a database access, since it is
 * created on the fly. The Slots require a database access to fetch Elexis-Appointments. Empty
 * slots are created on the fly. So, behind the scenes, it's a one-step process.
 */

export interface SlotPreset {
  begin: string,
  end: string,
  slotLength: number
}

export class Slot extends FhirObject implements Refiner {
  dataType: string = "Slot"


  constructor(sql, nosql) {
    super(sql, nosql)
  }


  compare(a: FHIR_Resource, b: FHIR_Resource): number {
    let ma = moment(a['start']);
    let mb = moment(b['start']);
    if (ma.isBefore(mb)) {
      return -1
    } else if (ma.isAfter(mb)) {
      return 1
    } else {
      return 0
    }
  }

  async fetchNoSQL(params): Promise<Array<FHIR_Slot>> {
    if (params.schedule) {
      let schedule = params.schedule.split("::")
      let day = moment(schedule[0])
      let lower = day.clone()
      lower.hour(0)
      lower.minute(0)
      lower.second(0)
      lower.millisecond(0)
      let upper = lower.clone()
      upper.add(1, 'days')
      let actor = schedule[1]
      let qbe = {
        "start"            : {
          "$gte": lower.format(),
          "$lte": upper.format()
        },
        "participant.actor": "Practitioner/" + actor
      }
      let appnts = await this.nosql.queryAsync("Appointment", qbe) as Array<FHIR_Appointment>
      //let presets = this._findPresetsForDay(schedule[0])
      return appnts.map(appnt=>{
        return<FHIR_Slot>{
          resourceType: "Slot",
          id: appnt.id,
          identifier: [this.makeIdentifier(appnt.id)],
          freeBusyType: appnt.type.text==='reserviert' ? "busy-unavailable" : "busy",
          start:appnt.start,
          end:appnt.end,
          overbooked:false,
          remark:appnt.description,
          contained:appnt,
          meta        : {
            tag: [{
              system: this.xid.elexis_appointment,
              code  : appnt.id
            }],
            "lastUpdated": appnt.meta.lastUpdated
          }
        }
      })
    }
    throw new Error("No schedule given")
  }


  /**
   * Fetch Termine from "agntermine" and create a series of free/busy slots from them
   * @param params an object containign at least the parameter "schedule", which is the schedule, the requested
   * slots shpuld belong to
   * @returns A Promise resolving to an Array of Slots
   */
  async fetchSQL(params): Promise<Array<FHIR_Resource>> {
    if (params.schedule) {

      // let slots = []
      let schedule = params.schedule.split("::")
      let appnts = await this.sql.queryAsync("SELECT * FROM agntermine WHERE deleted='0' AND Tag=? AND Bereich=?", [schedule[0], schedule[1]])
      return appnts.map(appnt => {
        let begin = moment(appnt['Tag'], "YYYYMMDD")
        begin.add(parseInt(appnt['Beginn']), "minutes")
        let end = moment(begin)
        end.add(parseInt(appnt['Dauer']), "minutes")
        return {
          resourceType: "Slot",
          id          : appnt['ID'],
          identifier  : [this.makeIdentifier(appnt['ID'])],
          freeBusyType: this._isUnassignable(appnt) ? "busy-unavailable" : "busy",
          start       : begin.format(),
          end         : end.format(),
          overbooked  : false,
          remark      : appnt['Grund'],
          contained   : Appointment._makeAppntFhir(appnt),
          meta        : {
            tag: [{
              system: this.xid.elexis_appointment,
              code  : appnt['ID']
            }],
            "lastUpdated": moment(appnt['lastupdate'] as number).format()
          }
        }
      })
      /*
       let presets = this._findPresetsForDay(schedule[0])

       if (appnts && appnts.length) {
       let sorted = appnts.sort((a, b) => {
       return parseInt(a['Beginn']) - parseInt(b['Beginn'])
       })
       return sorted.map

       let before = moment(sorted[0]['Tag'], "YYYYMMDD")
       sorted.forEach(appnt => {
       let begin = moment(appnt['Tag'], "YYYYMMDD")
       begin.add(parseInt(appnt['Beginn']), "minutes")
       let end = moment(begin)
       end.add(parseInt(appnt['Dauer']), "minutes")
       slots.push(this._makeSlot(before.format(), begin.format()))

       slots.push({
       resourceType: "Slot",
       id          : appnt['ID'],
       identifier  : this.makeIdentifier(appnt['ID']),
       freeBusyType: this._isUnassignable(appnt) ? "busy-unavailable" : "busy",
       start       : begin.format(),
       end         : end.format(),
       overbooked  : false,
       remark      : appnt['Grund'],
       contained   : Appointment._makeAppntFhir(appnt),
       meta        : {
       tag: [{
       system: this.xid.elexis_appointment,
       code  : appnt['ID']
       }]
       }
       })
       before = end
       })
       return this._reduceSlots(slots, presets, schedule[0])

       } else {
       // no appnts, create free slots.
       return this._createFreeSlots(presets)

       }
       */
    }

    else { // !params.schedule
      return []
    }
  }

  async pushSQL(fhir: FHIR_Slot): Promise<void> {
    if (fhir['contained']) {
      let query = Appointment.fhirToSql(fhir['contained'] as FHIR_Appointment)
      this.sql.insertAsync(query.query, query.values)
    }

  }


  pushNoSql(fhir: FHIR_Resource): Promise<void> {
    let appnt = fhir['contained']
    if (appnt) {
      let lastupdate = this.createTimestampMeta(appnt)
      appnt['meta'] = lastupdate
      return this.nosql.putAsync(appnt)
    } else {
      return new Promise<void>(resolve => {
        resolve()
      });
    }
  }

  private _createFreeSlots(presets) {
    let ret = []
    presets.forEach(preset => {
      let begin = preset.begin
      let from = moment(begin)
      let until = moment(preset.end)
      let act = from.clone()
      while (act.isBefore(until)) {
        let slotStart = act.format()
        act.add(preset.slotLength, "minutes")
        ret.push({
          resourceType: "Slot",
          id          : super.createUUID(),
          freeBusyType: "free",
          start       : slotStart,
          end         : act.format()
        })

      }
    })
    return ret
  }

  /**
   * remove "free" slots with a length of less than 5 minutes
   * @param slots an ordered Array of slots
   * @returns {Array} an ordered Array of slots, wich are either busy or longer than a minute.
   */
  private _reduceSlots(slots: Array<FHIR_Slot>, presets: Array<SlotPreset>, day: string): Array<FHIR_Slot> {
    let ret = []
    slots.forEach(slot => {
      if (slot.freeBusyType === 'free') {
        let ms = moment(slot.start)
        let me = moment(slot.end)
        let diff = (me.unix() - ms.unix()) / 60
        if (diff > 5) {
          // free slot of more than 5 minutes lengths -> check what's the default length for
          // this time of the day. If the slot is longer than that, split in several slots.
          let preset = this._findMatchingPreset(slot.start, presets, day)
          while (diff > preset.slotLength) {
            let newEnd = ms.clone().add(preset.slotLength, "minutes")
            ret.push(this._makeSlot(ms.format(), newEnd.format()))
            ms = newEnd.clone()
            slot['start'] = newEnd.format()
            diff = (me.unix() - newEnd.unix()) / 60
          }
          if (diff > 5) {
            ret.push(slot)
          }
        }
      } else { // Slot is busy -> keep anyway
        ret.push(slot)
      }
    })
    return ret
  }

  private _makeSlot(begin: string, end: string) {
    return {

      resourceType: "Slot",
      id          : this.createUUID(),
      freeBusyType: "free",
      start       : begin,
      end         : end
    }
  }

  private _isUnassignable(appnt): Boolean {
    return (appnt['TerminTyp'].toLocaleLowerCase() === "reserviert")
  }


  private _findPresetsForDay(day: string): Array<SlotPreset> {
    let conf = this.cfg.get("client")['agenda']
    return conf.slots.default.map((slot: SlotPreset) => {
      let fullStart = moment(`${day} ${slot.begin}`, "YYYYMMDD HH:mm").format()
      let fullEnd = moment(`${day} ${slot.end}`, "YYYYMMDD HH:mm").format()
      return {
        begin     : fullStart,
        end       : fullEnd,
        slotLength: slot.slotLength
      }
    })
  }

  private _findMatchingPreset(time: string, presets: Array<SlotPreset>, day: string): SlotPreset {
    for (let i = 0; i < presets.length; i++) {
      if (moment(time).isBetween(presets[i].begin, presets[i].end)) {
        return presets[i]
      }
    }
    let dfltSlot = this.cfg.get('client')['agenda'].slots.default[0]
    return {
      begin     : moment(`${day} ${dfltSlot.begin}`, "YYYYMMDD HH:mm").format(),
      end       : moment(`${day} ${dfltSlot.end}`, "YYYYMMDD HH:mm").format(),
      slotLength: dfltSlot.slotLength
    }
  }


}
