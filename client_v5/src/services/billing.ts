import { getService } from "./io";
import type { EncounterType as Konsultation } from "../models/encounter-model";
import { Tree, type ITreeListener } from "../models/tree";

type konsdef = {
  id: string, patientid: string, fallid: string,
  Patient?: any
  Fall?: any
  Konsultation?: any
}
class PatientListener implements ITreeListener {
  private patService
  constructor(private all: Array<konsdef>) {
    this.patService = getService("patient")
  }
  async fetchChildren(t: Tree<konsdef>): Promise<boolean> {
    const konsdef = t.getPayload()
    if (konsdef) {
      konsdef.Patient = await this.patService.get(konsdef.patientid)
      for (const cas of this.all) {
        t.insert(cas, (a, b) => a.fallid.localeCompare(b.fallid), new FallListener(this.all))
      }
      return true
    }
    return false
  }
}
class FallListener implements ITreeListener {
  private fallService
  constructor(private all: Array<konsdef>) {
    this.fallService = getService("fall")
  }
  async fetchChildren(t: Tree<konsdef>): Promise<boolean> {
    const konsdef = t.getPayload()
    if (konsdef) {
      konsdef.Fall = await this.fallService.get(konsdef.fallid)
      for (const cas of this.all) {
        t.insert(cas, (a, b) => a.fallid.localeCompare(b.fallid), new KonsListener(this.all))
      }
      return true
    }
    return false
  }
}
class KonsListener implements ITreeListener {
  private konsService
  constructor(private all: Array<konsdef>) {
    this.konsService = getService("konsultation")
  }
  async fetchChildren(t: Tree<konsdef>): Promise<boolean> {
    const konsdef = t.getPayload()
    if (konsdef) {
      konsdef.Konsultation = await this.konsService.get(konsdef.id)
      for (const kons of this.all) {
        const p=new Tree<konsdef>(t,konsdef)
      }
      return true
    }
    return false
  }
}

export class Billing {
  async getBillables(): Promise<Tree<any> {
    const konsService = getService("konsultation")
    const unbilled: Array<konsdef> = await konsService.get('unbilled')
    const ret = new Tree<konsdef>(null, null)
    for (let p of unbilled) {
      ret.insert(p, (a, b) => a.patientid.localeCompare(b.patientid), new PatientListener(unbilled))
    }
    return ret
  }

}
