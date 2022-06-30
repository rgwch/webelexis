import type { ElexisType, UUID, DATE } from "./elexistype";
import { ObjectManager } from "./object-manager";
import { DateTime } from "luxon";
import util from '../services/util'
export interface LabresultType extends ElexisType {
  id: UUID
  datum: DATE
  zeit: string  // HHMMSS
  kuerzel: string
  resultat: string
  reference: string
  unit: string
  gruppe: string
  prio: string
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

  public fetchForPatient(id:UUID, offset: number=0, maxItems: number=0){
    if (id) {
      const query = { patientId: id, $skip: offset }
      if (maxItems) {
        query["$limit"] = maxItems
      }
      return this.dataService.find({ query })
    } else {
      return Promise.resolve({ total: 0, data: [], limit: 50, skip: 0 })
    }
  }
}