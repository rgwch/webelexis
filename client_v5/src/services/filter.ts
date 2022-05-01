import { EncounterModel } from './../models/encounter-model';
import { Money } from './../models/money';
import { DateTime } from 'luxon'
import { getService } from './io';
import type { Tree } from '../models/tree'
import type { konsdef } from './billing'

export type BillingsFilter = {
  bSelected?: boolean;
  bFirstolder?: boolean;
  bLastolder?: boolean;
  bBetween?: boolean;
  bAmount?: boolean;
  bAmountBelow?: boolean;
  bName?: boolean;
  firstolderdays?: number;
  lastolderdays?: number;
  betweenfrom?: string;
  betweenuntil?: string;
  name?: string;
  amount?: number;
  amountBelow?: number
}

export class Filter {
  private konsService = getService('konsultation')
  public async applyBillingsFilter(node: Tree<konsdef>, filter: BillingsFilter): Promise<boolean> {

    if (filter.bName) {
      const regexp = new RegExp(filter.name + ".*", "i");
      if (
        node.payload.lastname.match(regexp) ||
        node.payload.firstname.match(regexp)
      ) {
        return true
      }
    }

    if (filter.bAmount || filter.bFirstolder || filter.bLastolder || filter.bBetween || filter.bAmountBelow) {
      const today = DateTime.now()
      const firstBefore = today.minus({ days: (filter.firstolderdays || 0) })
      const lastBefore = today.minus({ days: (filter.lastolderdays || 0) })
      const cases = node.getChildren();
      let sum = new Money(0)
      for (const tFall of cases) {
        const fallid = tFall?.payload?.fallid
        if (fallid) {
          const encounters = await this.konsService.find({ query: { fallid, rechnungsid: 'null' } })
          let first = DateTime.fromFormat("21000101", "yyyyLLdd")
          let last = DateTime.fromFormat("19001231", "yyyyLLdd")
          for (const k of encounters.data) {
            const enc = new EncounterModel(k)
            if (filter.bAmount || filter.bAmountBelow) {
              sum = sum.add(await enc.getSum())
              if (filter.bAmount && (sum.getValue() > filter.amount)) {
                return true
              }
            }
            if (filter.bFirstolder) {
              if (enc.getDateTime() < first) {
                first = enc.getDateTime()
              }
            }
            if (filter.bLastolder) {
              if (enc.getDateTime() > last) {
                last = enc.getDateTime()
              }
            }
          }
          if (filter.bFirstolder && first < firstBefore) {
            return true
          }
          if (filter.bLastolder && last < lastBefore) {
            return true
          }
        }
      }
      if (filter.bAmountBelow) {
        console.log(node.payload.lastname)
        if (sum.getValue() < (filter.amountBelow)) {
          console.log("Deselect: " + sum.getValue() + ", below " + filter.amountBelow)
          return true
        }
      }

    }
    return false;
  }
}
