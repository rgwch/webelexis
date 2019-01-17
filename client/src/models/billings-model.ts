/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { EncounterType } from './encounter-model';
import { DataSource, DataService } from './../services/datasource';
import { ElexisType, UUID } from './elexistype';
import { autoinject } from 'aurelia-framework';

export interface BillingType extends ElexisType {
  code?: string
  behandlung: UUID
  leistg_txt: string
  leistg_code: string
  klasse: string
  zahl: string
  vk_preis: string
}

@autoinject
export class BillingsManager {
  billingService: DataService
  billableService: DataService
  billableCache = new Map()

  constructor(private ds: DataSource) {
    this.billingService = this.ds.getService('billing')
    this.billableService = this.ds.getService('billable')
  }

  async getBillings(kons: EncounterType) {
    const ret = await this.billingService.find({ query: { behandlung: kons.id } })
    return ret.data.map(b => new BillingModel(b))
  }
  /**
   * get a billable from a code. Note: The code must have the form:
   * system!code, e.g. tarmed!00.0010
   * @param code 
   */
  async getBillable(code: string) {
    if (code.indexOf("!") == -1) {
      throw Error("bad code format for getBillable")
    }
    if (this.billableCache.has(code)) {
      return this.billableCache.get(code)
    } else {
      try {
        const billable = await this.billableService.get(code)
        this.billableCache.set(code, billable)
        return billable
      } catch (err) {
        alert(err)
        return undefined
      }
    }
  }

  async createBilling(billable, encounter: EncounterType, count: number, others: Array<BillingModel>): Promise<BillingType> {
    billable.encounter_id = encounter.id
    const existing = others.find(elem => elem.isBillingOf(billable))
    try {
      if (existing) {
        existing.increase(count)
        return await this.billingService.update(existing.getBilling().id, existing.getBilling())
      } else {
        billable.count = count.toString()
        const created: BillingType = await this.billingService.create(billable)
        others.push(new BillingModel(created))
        return created
      }
    } catch (err) {
      console.log(err)
    }
  }
  async setCount(item, count) {
    item.getBilling().zahl = count.toString()
    return await this.billingService.update(item.getBilling().id, item.getBilling())
  }
  async increaseCount(item: BillingModel) {
    item.increase()
    return await this.billingService.update(item.getBilling().id, item.getBilling())
  }
  async removeBilling(billing: BillingModel) {
    try {
      const b = billing.getBilling()
      const removed = await this.billingService.remove(b.id)
      return removed
    } catch (err) {
      console.log(err)
    }
  }
  async removeAllBillings(kons: EncounterType) {
    return await this.billingService.remove(null, { query: { behandlung: kons.id } })
  }
}

export class BillingModel {
  code: string
  constructor(private obj: BillingType) {
    this.code = this.obj.code || this.obj.leistg_code.split(/\s*-\s*/)[0]
  }
  getLabel() {
    return this.obj.zahl + " " + this.code + " " + this.obj.leistg_txt
  }
  getBilling() {
    return this.obj
  }
  isBillingOf = (billable) => {
    return (this.code == billable.code && this.obj.klasse == billable.codesystem)
  }
  getCount(): number {
    return parseInt(this.obj.zahl)
  }

  increase(num?: number) {
    if (!num) {
      num = 1
    }
    this.obj.zahl = (this.getCount() + num).toString();
  }
  compare = (other) => {
    if (this.code && other && other.code) {
      return this.code.localeCompare(other.code)
    } else if (this.code) {
      return 1
    } else if (other && other.code) {
      return -1
    } else {
      return 0
    }
  }
}
