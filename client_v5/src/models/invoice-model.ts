/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID, DATE } from './elexistype';
import { getService } from "../services/io";
import type { IService } from '../services/io'
import type { CaseType } from "./case-model";
import type { KontaktType } from "./kontakt-model";
import { DateTime } from 'luxon';
import type { Paginated } from '@feathersjs/feathers';
import { Money } from './money'

export interface InvoiceType extends ElexisType {
  rnnummer: string
  fallid?: UUID
  mandantid?: UUID
  rndatum: DATE
  rnstatus: string    // InvoiceState
  rndatumvon: DATE
  rndatumbis: DATE
  statusdatum: DATE
  betrag: string
  extinfo?: Uint8Array
  extjson?: any
  _Fall?: CaseType
  _Mandant?: KontaktType
  _Patname?: String
  output?: boolean
  selected?: boolean
}
export interface PaymentType extends ElexisType {
  rechnungsid: UUID
  betrag: string
  datum: DATE
  bemerkung: string
}

export enum InvoiceState {
  OPEN = 4,
  OPEN_AND_PRINTED,
  DEMAND_NOTE,
  DEMAND_NOTE_PRINTED,
  DEMAND_NOTE_2,
  DEMAND_NOTE_2_PRINTED,
  DEMAND_NOTE_3,
  DEMAND_NOTE_3_PRINTED,
  IN_EXECUTION,
  PARTIAL_LOSS,
  TOTAL_LOSS,
  PARTIAL_PAYMENT,
  PAID,
  EXCESSIVE_PAYMENT,
  CANCELLED
}

export const RnState = {
  OPEN: "4",
  OPEN_AND_PRINTED: "5",
  DEMAND_NOTE: "6",
  DEMAND_NOTE_PRINTED: "7",
  DEMAND_NOTE_2: "8",
  DEMAND_NOTE_2_PRINTED: "9",
  DEMAND_NOTE_3: "10",
  DEMAND_NOTE_3_PRINTED: "11",
  IN_EXECUTION: "12",
  PARTIAL_LOSS: "13",
  TOTAL_LOSS: "14",
  PARTIAL_PAYMENT: "15",
  PAID: "16",
  EXCESSIVE_PAYMENT: "17",
  CANCELLED: "18"
}

export class Invoice {
  private paymentService: IService<PaymentType> = getService("payments")
  private static billService: IService<InvoiceType> = getService("bills")
  private static utilService: IService<any> = getService("utility")
  static OUTPUT = "Ausgegeben"
  static STATECHANGE = "Statusänderung"
  static DESCRIPTION = "Webelexis printer"
  constructor(private bill: InvoiceType) { }

  public static async getFromNumber(nr: string): Promise<Invoice> {
    const result = (await this.billService.find({ query: { rnnummer: nr } })) as Paginated<InvoiceType>
    if (result.total > 0) {
      return result[0]
    } else {
      return undefined
    }
  }


  /**
   * get all transactions on this bill (positive and negative)
   * @returns
   */
  public async getTransactions(): Promise<Array<PaymentType>> {
    const result: Paginated<PaymentType> = (await this.paymentService.find({ query: { rechnungsid: this.bill.id } })) as Paginated<PaymentType>
    return result.data
  }
  /**
   * get all payments (i.e. positive transactions) on this bill)
   */
  public async getPayments(): Promise<Array<PaymentType>> {
    return (await this.getPayments()).filter(n => parseInt(n.betrag) > 0)
  }
  public async addPayment(amount: Money, remark: string, date: Date): Promise<PaymentType> {
    const remaining = await this.getRemaining()
    const newRemaining: Money = remaining.subtract(amount)
    if (newRemaining.isNeglectable()) {
      await this.setInvoiceState(RnState.PAID)
    } else if (newRemaining.isNegative()) {
      await this.setInvoiceState(RnState.EXCESSIVE_PAYMENT)
    } else if (newRemaining.isEqual(this.getAmount())) {
      // ?
    } else if (newRemaining.compareTo(remaining) < 0) {
      await this.setInvoiceState(RnState.PARTIAL_PAYMENT)
    }
    const ret: PaymentType = {
      rechnungsid: this.bill.id,
      betrag: amount.getCentsAsString(),
      datum: DateTime.fromJSDate(date).toFormat("yyyyLLdd"),
      bemerkung: remark
    }
    return this.paymentService.create(ret) as Promise<PaymentType>
  }
  public async getRemaining(): Promise<Money> {
    const payments = await this.getTransactions()
    let ret: Money = this.getAmount()
    for (const payment of payments) {
      const part = new Money(payment.betrag)
      ret = ret.subtract(part)
    }
    return ret
  }
  public getInvoiceState(): string {
    const state = this.bill.rnstatus
    if (state) {
      for (const prop in RnState) {
        if (RnState[prop] == state) {
          return prop
        }
      }
    } else {
      return "unknown"
    }
  }
  public async setInvoiceState(level: string): Promise<boolean> {
    try {

      const result: InvoiceType = await Invoice.billService.patch(this.bill.id, { rnstatus: level, statusdatum: DateTime.now().toFormat("yyyyLLdd") }) as InvoiceType
      if (result && (result.rnstatus == level)) {
        return true
      } else {
        return false;
      }

    } catch (err) {
      console.log(err)
      return false;
    }
  }
  /**
   * output a bill
   * @param toPrinter if true: send to printer, otherwise only export to directory
   * @returns true on success
   */
  public async print(toPrinter: boolean): Promise<boolean> {
    try {
      const printer: IService<InvoiceType> = getService("invoice")
      this.bill.output = toPrinter
      const ret = await printer.create(this.bill)
      if (ret) {
        switch (this.bill.rnstatus) {
          case RnState.OPEN: this.bill.rnstatus = RnState.OPEN_AND_PRINTED; break;
          case RnState.DEMAND_NOTE: this.bill.rnstatus = RnState.DEMAND_NOTE_PRINTED; break;
          case RnState.DEMAND_NOTE_2: this.bill.rnstatus = RnState.DEMAND_NOTE_2_PRINTED; break;
          case RnState.DEMAND_NOTE_3: this.bill.rnstatus = RnState.DEMAND_NOTE_3_PRINTED; break;
        }
        this.bill.statusdatum = DateTime.fromJSDate(new Date()).toFormat("yyyyLLdd");
        await this.addTrace(Invoice.OUTPUT, Invoice.DESCRIPTION + ": " + this.getInvoiceState())
        const modified = await Invoice.billService.update(this.bill.id, this.bill)

        return true
      }
      return false;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
  public getAmount = () => new Money(this.bill.betrag)
  public getRemark(): string {
    return this.bill.extjson.Bemerkung
  }
  public setRemark(rem): void {
    this.bill.extjson.Bemerkung = rem
  }
  public async addTrace(name: string, text: string): Promise<void> {
    const trace = this.bill.extjson[name]
    if (trace) {
      const unpacked: Array<string> = await Invoice.utilService.get("unpack", trace)
      unpacked.push(text)
      this.bill.extjson[name] = await Invoice.utilService.get("pack", unpacked)
    } else {
      this.bill.extjson[name] = await Invoice.utilService.get("pack", [text])
    }

  }

  public async getTrace(name: string): Promise<Array<string>> {
    const trace = this.bill.extjson[name]
    if (trace) {
      const unpacked = await Invoice.utilService.get("unpack", trace)
      return unpacked
    } else {
      return []
    }
  }
  public async delete() {
    const transactions = await this.getTransactions()
    for (const tx of transactions) {
      await this.paymentService.remove(tx.id)
    }
    await Invoice.billService.remove(this.bill.id)
  }
}

