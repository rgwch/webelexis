import { DataService } from 'services/datasource';
import { DataSource } from 'services/datasource';
import { autoinject } from "aurelia-framework";
import { ElexisType, UUID } from "./elexistype";
import { EncounterType } from './encounter-model';
import { BillingsManager, BillingModel } from './billings-model';

type Blockdef = {
  system: string
  code: string
  text?: string
}
export interface LeistungsblockType extends ElexisType {
  name: string
  billables?: Blockdef[]
  elements?: Blockdef[]
  mandantid: UUID
}

@autoinject
export class LeistungsblockManager {
  private lbService: DataService
  constructor(private bm: BillingsManager, private ds: DataSource) {
    this.lbService = ds.getService('leistungsblock')
  }

  public async findBlock(name: string, userid?: UUID) {
    const q = { name }
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

  public async getBlock(id: UUID) {
    return this.lbService.get(id)
  }

  /**
   * Apply a billing-block to an encounter
   * @param id id of block to apply
   * @param kons Encounter to apply billing
   * @param others other billings already applied to the encounter (to  check conformance etc.)
   */
  public async applyBlock(id: UUID, kons: EncounterType, others: BillingModel[]) {
    const lb: LeistungsblockType = await this.lbService.get(id)
    const result = this.createBillings(lb, kons, others)
    return result
  }

  public async getElements(lb: LeistungsblockType) {
    const elemente = lb.billables || lb.elements
    const elems = await Promise.all(elemente.map(el => {
      return this.bm.getBillable(el.system + "!" + el.code)
    }))
    return elems
  }

  public async createBillings(lb: LeistungsblockType, kons: EncounterType, others: BillingModel[]) {
    const elemente = lb.billables || lb.elements
    const billables = await Promise.all(elemente.map(el => {
      return this.bm.getBillable(el.system + "!" + el.code)
    }))
    /* must be for..of loop for sharing 'others'
    return Promise.all(billables.map(billable => {
      billable.encounter_id = kons.id
      return this.bm.createBilling(billable, kons, 1, others)
    }))
    */
    const ret = []
    for (const billable of billables) {
      billable.encounter_id = kons.id
      ret.push(await this.bm.createBilling(billable, kons, 1, others))
    }
  }
}

export class LeistungsblockModel {
  constructor(private block: LeistungsblockType) { }
  public async getElementIDs() {
    const elemente = this.block.billables || this.block.elements
    const billables = elemente.map(el => {
      return (el.system + "!" + el.code)
    })
    return billables
  }
}
