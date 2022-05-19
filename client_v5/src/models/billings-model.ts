/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import type { EncounterType } from './encounter-model'
import type { ElexisType, UUID } from './elexistype'
import { getService } from '../services/io'

export interface BillingType extends ElexisType {
  code?: string
  behandlung: UUID
  leistg_txt: string
  leistg_code: string
  klasse: string
  zahl: string
  vk_preis: string
}

export interface Billable {
  uid: string
  codestystem: string
  encounter: UUID
  count: number
}
export class BillingsManager {
  private billingService
  private billableService
  private billableCache = new Map()

  constructor() {
    this.billingService = getService('billing')
    this.billableService = getService('billable')
  }

  /**
   * Fetch all billings for a given encounter
   * @param kons
   */
  public async getBillings(kons_id: string): Promise<BillingType[]> {
    const ret = await this.billingService.find({
      query: { behandlung: kons_id },
    })
    return ret.data
  }
  /**
   * get a billable from a code. Note: The code must have the form:
   * system!code, e.g. tarmed!00.0010
   * @param code
   */
  public async getBillable(code: string): Promise<Billable> {
    if (code.indexOf('!') === -1) {
      throw Error('bad code format for getBillable')
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

  /**
   * Create a Billing from a Billable. If the same Billable has been billed already on the same
   * encounter: Only increase count accordingly.
   * @param billable The Billable
   * @param encounter The encouter where the billing should be applied
   * @param count Number of times to apply the billing
   * @param others Other Billings already existing oj the encounter
   */
  public async createBilling(
    billable,
    encounter: EncounterType,
    count: number,
    others: BillingType[],
  ): Promise<BillingType> {
    billable.encounter_id = encounter.id
    const existing = others.find((elem) => this.isBillingOf(elem, billable))
    try {
      if (existing) {
        this.increase(existing, count)
        return await this.billingService.update(
          existing.id,
          existing
        )
      } else {
        billable.count = count.toString()
        const created: BillingType = await this.billingService.create(billable)
        others.push(created)
        return created
      }
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Set the count of a Billing
   * @param item
   * @param count
   */
  public async setCount(item: BillingType, count: number) {
    item.zahl = count.toString()
    return await this.billingService.update(
      item.id,
      item
    )
  }
  /**
   * Increase the coubt of a Billing
   * @param item
   */
  public async increaseCount(item: BillingType) {
    this.increase(item)
    return await this.billingService.update(
      item.id,
      item
    )
  }

  /**
   * Remove a Billing from an encounter
   * @param billing
   */
  public async removeBilling(billing: BillingType) {
    try {
      const removed = await this.billingService.remove(billing.id)
      return removed
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * remove all billings from an encounter
   * @param kons
   */
  public async removeAllBillings(kons: EncounterType) {
    return await this.billingService.remove(null, {
      query: { behandlung: kons.id },
    })
  }
  public getLabel(obj: BillingType) {
    return obj.zahl + ' ' + this.getCode(obj) + ' ' + obj.leistg_txt
  }
  public getCode(obj: BillingType) {
    const code = obj.code || obj.leistg_code.split(/\s*-\s*/)[0]
    return code
  }
  public isBillingOf = (obj: BillingType, billable) => {
    return (
      this.getCode(obj) === billable.code && obj.klasse === billable.codesystem
    )
  }
  public getCount(obj: BillingType): number {
    return parseInt(obj.zahl, 10)
  }
  public getAmount(obj: BillingType): number {
    return this.getCount(obj) * parseFloat(obj.vk_preis)
  }
  public increase(obj: BillingType, num?: number) {
    if (!num) {
      num = 1
    }
    obj.zahl = (this.getCount(obj) + num).toString()
  }
  public compare = (first: BillingType, second: BillingType) => {
    const firstCode = this.getCode(first)
    const secondCode = this.getCode(second)
    if (firstCode && secondCode) {
      return firstCode.localeCompare(secondCode)
    } else if (firstCode) {
      return 1
    } else if (secondCode) {
      return -1
    } else {
      return 0
    }
  }
}


