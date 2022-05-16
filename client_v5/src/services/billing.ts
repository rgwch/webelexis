import type { InvoiceType } from './../models/invoice-model'
import { Invoice, RnState } from '../models/invoice-model'
import { getService } from './io'
import { EncounterModel } from '../models/encounter-model'
import type { EncounterType } from '../models/encounter-model'
import type { ITreeListener } from "../models/tree";
import { Tree } from '../models/tree'
import { KontaktManager } from '../models/kontakt-model'
import type { CaseType } from '../models/case-model'
import { DateTime } from 'luxon'
import { Money } from '../models/money'
import { encounterManager, billingsManager, caseManager, diagnoseManager } from '../models'
import type { DiagnoseType } from '../models/diagnose-model'

export type konsdef = {
  konsid: string
  patientid: string
  fallid: string
  falldatum: string
  falltitel: string
  konsdatum: string
  firstname: string
  lastname: string
  birthdate: string
  Patient?: any
  Fall?: any
  Konsultation?: any
}

export class Billing {
  /**
   * fetch a Tree of all unbilled encounters. One Node per patient, one case-node per case, containing all encounters for that case.
   * @returns
   */
  async getBillables(listener?: ITreeListener): Promise<Tree<konsdef>> {
    const konsService = getService('konsultation')
    const patService = getService('patient')
    const unbilled: Array<konsdef> = await konsService.find({ query: { id: 'unbilled' } })
    const ret = new Tree<konsdef>(null, null)
    for (let p of unbilled) {
      const patNode = ret.insert(p, (a, b) =>
        a.patientid.localeCompare(b.patientid), listener
      )
      patNode.props.open = false
      patNode.props.type = "p"
      for (let q of unbilled) {
        if (q.patientid === patNode.payload.patientid) {
          const caseNode = patNode.insert(q, (a, b) =>
            a.fallid.localeCompare(b.fallid), listener
          )
          caseNode.props.open = false
          caseNode.props.type = "c"
          for (let l of unbilled) {
            if (l.fallid === caseNode.payload.fallid) {
              const encNode = caseNode.insert(l, (a, b) =>
                a.konsid.localeCompare(b.konsid), listener
              )
              encNode.props.open = false
              encNode.props.type = "e"
            }
          }
        }
      }
    }
    return ret
  }

  async createBill(fall: Tree<konsdef>): Promise<InvoiceType> {
    const errors: Array<String> = []
    const km = new KontaktManager()
    const billsService = getService('bills')
    const konsen = fall.getChildren()
    const rechnung: Partial<InvoiceType> = {}
    let f: CaseType
    let diagnosen: Array<DiagnoseType> = []
    let startDate: DateTime = DateTime.fromISO('2200-12-31')
    let endDate: DateTime = DateTime.fromISO('1900-01-01')
    let billAmount = new Money(0)
    let konsultationen: Array<EncounterModel> = []
    for (const k of konsen) {
      try {
        const enc = (await encounterManager.fetch(k.payload.konsid)) as EncounterType
        const kons = new EncounterModel(enc)
        konsultationen.push(kons)
        const mandator = await kons.getMandator()
        if (!mandator) {
          errors.push('No mandator for ' + enc.id)
        } else {
          rechnung._Mandant = mandator
          rechnung.mandantid = mandator.id
        }
        const fall = await kons.getCase()
        if (fall == null) {
          errors.push('No case for encounter ' + enc.id)
        } else {
          if (rechnung.fallid) {
            if (fall.id != rechnung.fallid) {
              errors.push('different cases')
            }
          } else {
            rechnung.fallid = fall.id
            rechnung._Fall = fall
          }
          const cas = fall
          caseManager.setBillingDate(cas, null)
          if (diagnosen.length === 0) {
            diagnosen = diagnosen.concat(await diagnoseManager.findForKons(enc.id))
          }
          const konsdat = kons.getDateTime()
          if (konsdat < startDate) {
            startDate = konsdat
          }
          if (konsdat > endDate) {
            endDate = konsdat
          }
          const l = await kons.getBillings()
          for (const billing of l) {
            const amountCents = billingsManager.getAmount(billing)
            billAmount = billAmount.addCents(amountCents)
          }
        }
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length > 0) {
      alert("errors :" + JSON.stringify(errors))
    } else {
      try {
        rechnung.betrag = billAmount.getCentsAsString()
        rechnung.rndatumvon = startDate.toFormat('yyyyLLdd')
        rechnung.rndatumbis = endDate.toFormat('yyyyLLdd')
        rechnung.rndatum = DateTime.now().toFormat('yyyyLLdd')
        // getNextRnNummer
        const finalized = await billsService.create(rechnung)
        for (const k of konsultationen) {
          k.setInvoice(finalized.id)
        }
        const invoice = new Invoice(finalized)
        await invoice.setInvoiceState(RnState.OPEN)
        return finalized
      } catch (error) {
        alert(error)
        throw error
      }
    }
  }
}
