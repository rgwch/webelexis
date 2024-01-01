/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import type { ElexisType, UUID, DATE } from "./elexistype";
import { ObjectManager } from "./object-manager";
import { DateTime } from "luxon";
import util from '../services/util'
import { text } from "svelte/internal";
export interface LabresultType extends ElexisType {
  id: UUID
  datum: DATE
  zeit: string  // HHMMSS or null
  kuerzel: string
  titel: string,
  resultat: string
  reference: string
  unit: string
  gruppe: string
  prio: string
}

export type LABRESULTS = {
  dates: Array<string>
  items: {
    [group: string]: {
      [key: string]: Array<LabresultType>
    }
  }
}
export class LabresultManager extends ObjectManager {
  constructor() {
    super("labresults")
  }

  /**
   * create a Date/Time string from the datum and zeit fields of a
   * labresult. Handle the case of zeit being null correctly.
   * @param obj
   * @returns Human readable form of the result's date and time.
   */
  public getTimeLabel(obj: LabresultType): string {
    let dt = util.ElexisDateToLuxon(obj.datum);
    if (obj.zeit && obj.zeit.length > 1) {
      const hr = obj.zeit.substring(0, 2)
      dt = dt.plus({ hours: parseInt(hr, 10) })
      if (obj.zeit.length > 3) {
        const min = obj.zeit.substring(2, 4)
        dt = dt.plus({ minutes: parseInt(min) })
        if (obj.zeit.length > 5) {
          const sec = obj.zeit.substring(4, 6)
          dt = dt.plus({ seconds: parseInt(sec) })
        }
      }
    }
    return util.LuxonToLocalDate(dt)
  }
  /**
   * label with only date, result and unit
   * @param obj
   * @returns
   */

  public shortLabel(obj: LabresultType) {
    const stil = this.isPathologic(obj) ? "color: red" : "color: green"
    return `<small>${this.getTimeLabel(obj)}</small>:&nbsp;&nbsp;<span style="${stil}">${obj.resultat}</span>&nbsp;<small>${obj.unit}</small>`
  }
  /**
   * Full label
   * @param obj
   * @returns
   */
  public getLabel(obj: LabresultType) {
    let ret = this.getTimeLabel(obj) + ": " + obj.kuerzel + ": " + obj.resultat + " (" + obj.reference + ")"
    return ret;
  }

  /**
   * Check if a result's value is pathologic in terms being out of the reference range.
   * @param obj
   * @returns true if this result is pathologic, false if within norm range, or if result could
   * not be matched with norm range.
   */
  public isPathologic(obj: LabresultType): boolean {
    const r = obj.reference?.trim() || ""
    const val = parseFloat(obj.resultat)
    if (r.startsWith("<")) {
      return (val >= parseFloat(r.substring(1)))
    } else if (r.startsWith(">")) {
      return (val <= parseFloat(r.substring(1)))
    } else {
      const rr = r.split(/-/)
      if (rr.length == 2) {
        const lower = parseFloat(rr[0].trim())
        const upper = parseFloat(rr[1].trim())
        return val < lower || val > upper
      } else {
        return false
      }
    }
  }



  /**
   * grouped result
   * @param x
   * @param fetched
  */
  private mixIn(x: LABRESULTS, fetched: query_result) {
    const data = fetched.data as Array<LabresultType>
    for (const val of data) {
      const dt = val.datum + (val.zeit ? val.zeit : "")
      if (x.dates.indexOf(dt) == -1) {
        x.dates.push(dt)
      }
      let group = x.items[val.gruppe] || {}
      let it: Array<LabresultType> = group[val.titel] || []
      it.push(val)
      it.sort((a, b) => {
        let comp = a.datum.localeCompare(b.datum)
        if (comp == 0) {
          if (a.zeit && b.zeit) {
            comp = a.zeit.localeCompare(b.zeit)
          }
        }
        return -comp
      })
      group[val.titel] = it
      x.items[val.gruppe] = group
    }
    x.dates.sort((a, b) => b.localeCompare(a))
  }


  /**
   * Fetch all Lab results for a given patients
   * @param id
   * @returns
*/
  public async fetchAllForPatient(id: UUID): Promise<LABRESULTS> {
    if (id) {
      const ret = { dates: [], items: {} }
      const query = { patientId: id, $limit: 100, $skip: 0 }
      let result;
      do {
        result = await this.dataService.find({ query })
        this.mixIn(ret, result)
        query.$skip = result.skip + result.data.length
      } while (result.data.length > 0)
      return ret
    } else {
      return Promise.resolve({ dates: [], items: {} })
    }
  }
}
