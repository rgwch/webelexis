import type { ElexisType, UUID, DATE } from "./elexistype";
import { ObjectManager } from "./object-manager";
import { DateTime } from "luxon";
import util from '../services/util'
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

  public getLabel(obj: LabresultType) {
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
    let ret = util.LuxonToLocalDate(dt) + ": " + obj.kuerzel + ": " + obj.resultat + " (" + obj.reference + ")"
    return ret;
  }

  public isPathologic(obj: LabresultType): boolean {
    const r = obj.reference.trim()
    const val = parseFloat(obj.resultat)
    if (r.startsWith("<")) {
      return (val >= parseFloat(r.substring(1)))
    } else if (r.startsWith(">")) {
      return (val <= parseFloat(r.substring(1)))
    } else {
      const rr=r.split(/-/)
      if(rr.length==2){
        const lower=parseFloat(rr[0].trim())
        const upper=parseFloat(rr[1].trim())
        return val<lower || val>upper
      }else{
        return false
      }
    }
  }

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
    x.dates.sort((a, b) => a.localeCompare(b))
  }
  public async fetchForPatient(id: UUID): Promise<LABRESULTS> {
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