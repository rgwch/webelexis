import { DataService } from 'services/datasource';
import { DataSource } from 'services/datasource';
import { autoinject } from "aurelia-framework";
import { ElexisType } from "./elexistype";
import { EncounterType } from './encounter';
import { BillingsManager } from './billings-model';

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

  async createBillings(lb: LeistungsblockType, kons: EncounterType) {
    const elemente = lb.billables || lb.elements
    const ret = []
    for (const element of elemente) {
      try {
        const billable = await this.bm.getBillable(element.system + "!" + element.code)
        if (billable) {
          billable.encounter_id=kons.id
          const billed = await this.bm.createBilling(billable, kons, 1)
          ret.push(billed)
        }
      } catch (err) {
        alert(err)
      }
    }
    return ret
  }
}
