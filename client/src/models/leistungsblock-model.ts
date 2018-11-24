import { DataService } from 'services/datasource';
import { DataSource } from 'services/datasource';
import { autoinject } from "aurelia-framework";
import { ElexisType } from "./elexistype";
import { EncounterType } from './encounter';
import { BillingsManager, BillingModel } from './billings-model';

type Blockdef = {
  system: string
  code: string
  text?: string
}
export interface LeistungsblockType extends ElexisType {
  name: string
  billables?: Array<Blockdef>
  elements?: Array<Blockdef>
  mandantid: string
}

@autoinject
export class LeistungsblockManager {
  private lbService: DataService
  constructor(private bm: BillingsManager, private ds: DataSource) {
    this.lbService = ds.getService('leistungsblock')
  }

  async findBlock(name: string, userid?: string) {
    const q = {
      name: name
    }
    if (userid) {
      q["mandantid"] = userid
    }
    const found = await this.lbService.find({ query: q })
    if (found && found.data && found.data.length > 0) {
      return found.data[0]
    } else {
      return undefined
    }
  }

  async getBlock(id) {
    return this.lbService.get(id)
  }
  async applyBlock(id, kons: EncounterType, others: Array<BillingModel>) {
    const lb: LeistungsblockType = await this.lbService.get(id)
    const result = this.createBillings(lb, kons, others)
    return result
  }

  async createBillings(lb: LeistungsblockType, kons: EncounterType, others: Array<BillingModel>) {
    const elemente = lb.billables || lb.elements
    const billables = await Promise.all(elemente.map(el => {
      return this.bm.getBillable(el.system + "!" + el.code)
    }))
    return Promise.all(billables.map(billable => {
      billable.encounter_id = kons.id
      return this.bm.createBilling(billable, kons, 1, others)
    }))
    /*
    const ret = []
    for (const element of elemente) {
      try {
        const billable = await this.bm.getBillable(element.system + "!" + element.code)
        if (billable) {
          billable.encounter_id = kons.id
          const billed = await this.bm.createBilling(billable, kons, 1, others)
          ret.push(billed)
        }
      } catch (err) {
        alert(err)
      }
    }
    
    return ret
    */
  }
}
