import { getService } from "./io";
import type { EncounterType as Konsultation } from "../models/encounter-model";
import { Tree, type ITreeListener } from "../models/tree";

export type konsdef = {
  konsid: string, patientid: string, fallid: string,
  falldatum: string
  falltitel: string
  konsdatum: string
  firstname: string
  lastname: string
  Patient?: any
  Fall?: any
  Konsultation?: any
}
/**
 * Expand full content of 'Patient' entry and add "Fall" nodes to each "Patient" node
 */
class PatientListener implements ITreeListener {
  private patService
  constructor(private all: Array<konsdef>) {
    this.patService = getService("patient")
  }
  async fetchChildren(t: Tree<konsdef>): Promise<boolean> {
    const konsdef = t.payload
    if (konsdef) {
      konsdef.Patient = await this.patService.get(konsdef.patientid)
      for (const cas of this.all) {
        if (cas.patientid === konsdef.patientid) {
          t.insert(cas, (a, b) => a.fallid.localeCompare(b.fallid), new FallListener(this.all))
        }
      }
      return true
    }
    return false
  }
}
/**
 * Expand full content of 'Fall' node and add related 'Konsultation" entries.
 */
class FallListener implements ITreeListener {
  private fallService
  constructor(private all: Array<konsdef>) {
    this.fallService = getService("fall")
  }
  async fetchChildren(t: Tree<konsdef>): Promise<boolean> {
    const konsdef = t.payload
    if (konsdef) {
      for (let f of this.all) {
        if (f.patientid === konsdef.patientid) {
          t.insert(f, (a, b) => a.fallid.localeCompare(b.fallid))
        }
      }
      return true
    }
    return false
  }
}

export class Billing {
  async getBillables(): Promise<Tree<konsdef>> {
    const konsService = getService("konsultation")
    const patService = getService("patient")
    const unbilled: Array<konsdef> = await konsService.get('unbilled')
    const ret = new Tree<konsdef>(null, null)
    for (let p of unbilled) {
      const patNode = ret.insert(p, (a, b) => a.patientid.localeCompare(b.patientid))
      patNode.props.open = false
      for (let q of unbilled) {
        if (q.patientid === patNode.payload.patientid) {
          const caseNode = patNode.insert(q, (a, b) => a.fallid.localeCompare(b.fallid))
          caseNode.props.open = false
          for (let l of unbilled) {
            if (l.fallid === caseNode.payload.fallid) {
              const encNode = new Tree<konsdef>(caseNode, l)
              encNode.props.open = false
            }
          }
        }
      }
    }
    return ret
  }
}
