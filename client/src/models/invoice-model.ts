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
import { _ } from 'svelte-i18n'

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
  _Patname?: string
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

/**
 * Create a standard invoice
 */
export class Invoice {
  private paymentService: IService<PaymentType> = getService("payments")
  private static billService: IService<InvoiceType> = getService("bills")
  private static utilService: IService<any> = getService("utility")
  static TRACE_OUTPUT = "Ausgegeben"
  static TRACE_STATECHANGE = "Statusänderung"
  static TRACE_CORRECTION = "Korrektur"
  static TRACE_REJECTED = "Zurückgewiesen"
  static TRACE_PAYMENT = "Zahlung"
  static TRACE_REMARKS = "Bemerkungen"

  static DESCRIPTION = "Webelexis printer"
  private trl
  constructor(private bill: InvoiceType) {
    _.subscribe(t => this.trl = t)
  }

  /**
   * Find an invoice by number
   * @param nr 
   * @returns 
   */
  public static async getFromNumber(nr: string): Promise<Invoice> {
    const result = (await this.billService.find({ query: { rnnummer: nr } })) as Paginated<InvoiceType>
    if (result.total > 0) {
      return result[0]
    } else {
      return undefined
    }
  }

  /**
   * get all transactions on this invoice (positive and negative)
   * @returns
   */
  public async getTransactions(): Promise<Array<PaymentType>> {
    const result: Paginated<PaymentType> = (await this.paymentService.find({ query: { rechnungsid: this.bill.id } })) as Paginated<PaymentType>
    return result.data
  }
  /**
   * get all payments (i.e. positive transactions) on this invoice)
   */
  public async getPayments(): Promise<Array<PaymentType>> {
    return (await this.getPayments()).filter(n => parseInt(n.betrag) > 0)
  }

  /**
   * Add a payment
   * @param amount
   * @param remark
   * @param date
   * @returns The PaymentType (Which is already saved to the database)
   */
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
    const payment: PaymentType = {
      rechnungsid: this.bill.id,
      betrag: amount.getCentsAsString(),
      datum: DateTime.fromJSDate(date).toFormat("yyyyLLdd"),
      bemerkung: remark
    }
    const ret = await this.paymentService.create(payment) as PaymentType
    this.addTrace(Invoice.TRACE_PAYMENT, (ret).datum + ": " + ret.betrag)
    return ret
  }

  /**
   * Find unpaid amoount of this invoice
   * @returns The unpaid amount as Money instance
   */
  public async getRemaining(): Promise<Money> {
    const payments = await this.getTransactions()
    let ret: Money = this.getAmount()
    for (const payment of payments) {
      const part = new Money(payment.betrag)
      ret = ret.subtract(part)
    }
    return ret
  }

  /**
   * Get invoice state as textual representation
   * @param if given: Text for that state, else Text for current state
   * @returns
   */
  public getInvoiceState(stateID?: string): string {
    const state = stateID || this.bill.rnstatus
    if (state) {
      for (const prop in RnState) {
        if (RnState[prop] == state) {
          return this.trl("billing." + prop) || prop
        }
      }
    } else {
      return "unknown"
    }
  }
  /**
   * Change invoice state
   * @param level 
   * @returns 
   */
  public async setInvoiceState(level: string): Promise<boolean> {
    try {

      const result: InvoiceType = await Invoice.billService.patch(this.bill.id, { rnstatus: level, statusdatum: DateTime.now().toFormat("yyyyLLdd") }) as InvoiceType
      if (result && (result.rnstatus == level)) {
        this.bill = result
        this.addTrace(Invoice.TRACE_STATECHANGE, result.rnstatus)
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
   * output an invoice
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
          case RnState.OPEN: await this.setInvoiceState(RnState.OPEN_AND_PRINTED); break;
          case RnState.DEMAND_NOTE: await this.setInvoiceState(RnState.DEMAND_NOTE_PRINTED); break;
          case RnState.DEMAND_NOTE_2: await this.setInvoiceState(RnState.DEMAND_NOTE_2_PRINTED); break;
          case RnState.DEMAND_NOTE_3: await this.setInvoiceState(RnState.DEMAND_NOTE_3_PRINTED); break;
          default:
            console.log("State not automatically modifiyable " + this.bill.rnstatus)
        }
        this.bill.statusdatum = DateTime.now().toFormat("yyyyLLdd");
        const modified = await Invoice.billService.update(this.bill.id, this.bill)
        await this.addTrace(Invoice.TRACE_OUTPUT, `${Invoice.DESCRIPTION}: ${this.getInvoiceState()}`);
        return true
      }
      return false;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
  /**
   * get total amount for this invoice
   * @returns 
   */
  public getAmount = () => new Money(this.bill.betrag)
  /**
   * Get remark of this invoice
   * @returns 
   
  public getRemark(): string {
    return this.bill.extjson.Bemerkung
  }
  */
  /**
   * add a remark on this invoice
   * @param rem 
   */
  public async setRemark(rem): Promise<void> {
    const patched = await Invoice.utilService.patch("setField", this.bill.extinfo, { query: { field: Invoice.TRACE_REMARKS, entry: rem } })
    this.bill.extinfo = patched
  }

  /**
   * Add a trace message on this bill
   * @param name type of the trace
   * @param message contents of the message
   */
  public async addTrace(name: string, message: string): Promise<void> {
    if (!this.bill.extjson) {
      this.bill.extjson = {}
    }
    if (!this.bill.extjson[name]) {
      this.bill.extjson[name] = []
    }
    const timestamp = DateTime.now().toFormat("dd.LL.yyyy, HH:mm:ss")
    const text = timestamp + ": " + message
    this.bill.extjson[name].push(text)
    const patched = await Invoice.utilService.patch("addTrace", this.bill.extinfo, { query: { field: name, entry: text } })
    this.bill.extinfo = patched
    Invoice.billService.patch(this.bill.id, { extinfo: patched })
  }
  
  public getTrace(name: string): Array<string> {
    const trace = this.bill.extjson ? this.bill.extjson[name] : []
    return trace || []
  }


  /**
   * Delete this invoice and all linked transactions
   */
  public async delete() {
    const transactions = await this.getTransactions()
    for (const tx of transactions) {
      await this.paymentService.remove(tx.id)
    }
    await Invoice.billService.remove(this.bill.id)
  }
 
}

