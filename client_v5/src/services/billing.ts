import type { InvoiceType } from './../models/invoice-model';
import { DiagnoseManager, DiagnoseModel } from '../models/diagnose-model'
import { getService } from "./io";
import { EncounterModel, EncounterManager } from "../models/encounter-model";
import type { EncounterType } from '../models/encounter-model';
import { Tree } from "../models/tree";
import { BillingModel, BillingsManager } from "../models/billings-model";
import { KontaktManager } from '../models/kontakt-model'
import { CaseModel } from '../models/case-model'

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
              const encNode = caseNode.insert(l, (a, b) => a.konsid.localeCompare(b.konsid))
              encNode.props.open = false
            }
          }
        }
      }
    }
    return ret
  }

  async createBill(fall: Tree<konsdef>) {
    const errors: Array<String> = []
    const bm = new BillingsManager()
    const em = new EncounterManager()
    const km = new KontaktManager()
    const dm = new DiagnoseManager()
    const konsen = fall.getChildren()
    const rechnung: Partial<InvoiceType> = {}
    let f: CaseModel
    let diagnosen: Array<DiagnoseModel> = []
    for (const k of konsen) {
      try {
        const enc = await em.fetch(k.payload.konsid) as EncounterType
        const kons = new EncounterModel(enc)
        const mandator = await kons.getMandator()
        if (!mandator) {
          errors.push("No mandator for " + enc.id)
        } else {
          rechnung._Mandant = mandator
          rechnung.mandantid = mandator.id
        }
        const fall = await kons.getCase()
        if (fall == null) {
          errors.push("No case for encounter " + enc.id)
        } else {
          if (rechnung.fallid) {
            if (fall.id != rechnung.fallid) {
              errors.push("different cases")
            }
          } else {
            rechnung.fallid = fall.id
            rechnung._Fall = fall
          }
          const cas = new CaseModel(fall)
          cas.setBillingDate(null)
          if (diagnosen.length === 0) {
            diagnosen = diagnosen.concat(await dm.findForKons(enc.id))
          }
        }

      } catch (err) {
        errors.push(err)
      }
    }
  }


}
