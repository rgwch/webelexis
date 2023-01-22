import type { ElexisType, DATE, DATETIME, UUID } from "./elexistype";
import util from '../services/util'
import { ObjectManager } from './object-manager'

export interface AUFType extends ElexisType {
  datumvon: DATE
  datumbis: DATE
  prozent: string
  grund?: string
  fallid?: UUID
  patientid: UUID
  aufzusatz?: string
  briefid?: UUID
  datumauz: DATE
}

export class AUFManager extends ObjectManager {
  constructor() {
    super("auf")
  }

  public getLabel = (obj: AUFType) => {
    let ret = util.ElexisDateToLocalDate(obj.datumauz) + ":" +
      util.ElexisDateToLocalDate(obj.datumvon) + "-" +
      util.ElexisDateToLocalDate(obj.datumbis) + ": " +
      obj.prozent + "% (" + obj.grund + ")"
    return ret
  }
}
