/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { CaseType } from './case-model'
import type { ElexisType, UUID } from './elexistype'
import type { PatientType } from './patient-model'
import type { KontaktType } from './kontakt-model'
import { KontaktManager } from './kontakt-model'
import { ObjectManager } from './object-manager'
import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'
import { weekDaysShort } from './timedate'
import { BillingsManager, type BillingType } from './billings-model'
import { getService } from '../services/io'
import { Money } from './money'
import type { FlexformConfig } from '../widgets/flexformtypes'
import type { Service } from '@feathersjs/feathers'
import type { InvoiceType } from './invoice-model'
import { caseManager } from '.'

let trl
const un = _.subscribe((res) => {
  trl = res
})

export type EncounterEntry = {
  remark: string // Editor of last modification
  html?: string // HTML Version of the entrytext
  timestamp: string // Date of last modification
  json?: any
}
/**
 * An Elexis "Konsultation"
 */
export interface EncounterType extends ElexisType {
  datum: string // YYYYMMDD
  zeit: string // HHmmss
  mandantid: UUID // UUIDv4 (36) or ElexisID (25)
  fallid: UUID // UUIDv4 (36) or ElexisID (25)
  rechnungsid?: UUID // UUIDv4 (36) or ElexisID (25)
  leistungen?: string // usually null
  eintrag: EncounterEntry
  _Patient?: PatientType
  _Fall?: CaseType
  _Mandator?: KontaktType
  _Rechnung?: InvoiceType
  _Sum?: Money
}

export class EncounterManager extends ObjectManager {
  constructor() {
    super('konsultation')
  }

  public getLabel(enc: EncounterType): Promise<string> {
    return new EncounterModel(enc).getLabel()
  }
  public getSimpleLabel(enc: EncounterType): string {
    const dat = DateTime.fromISO(enc.datum)
    const weekday = weekDaysShort[dat.weekday - 1]
    return (
      weekday +
      ', ' +
      dat.toFormat(trl('formatting.date')) +
      ', ' +
      enc.zeit.substring(0, 2) + ':' + enc.zeit.substring(2, 4)
    )
  }
 
  public getCase(enc: EncounterType): Promise<CaseType>{
    return new EncounterModel(enc).getCase()
  }

  public async fetchForTimes(dateFrom: string, dateUntil: string, mandant: UUID): Promise<Array<EncounterType>> {
    const from = DateTime.fromISO(dateFrom).toFormat('yyyyLLdd')
    const until = DateTime.fromISO(dateUntil).toFormat('yyyyLLdd')
    const query = {
      $and: [{ datum: { $gte: from } }, { datum: { $lte: until } }],
      $sort: { datum: 1 }
    }
    if (mandant) {
      query["mandantid"] = mandant
    }
    const ret = (await super.fetchAll(query)) as Array<EncounterType>
    //return ret

    return ret.sort((a, b) => {
      if (a.datum === b.datum) {
        return a.zeit.localeCompare(b.zeit)
      } else {
        return 0
      }
    })

  }
  public fetchForTimes0(
    dateFrom: string,
    dateUntil: string,
    mandant: UUID,
  ): Promise<EncounterType[]> {
    const from = DateTime.fromISO(dateFrom).toFormat('yyyyLLdd')
    const until = DateTime.fromISO(dateUntil).toFormat('yyyyLLdd')

    return this.dataService
      .find({
        query: {
          $and: [{ datum: { $gte: from } }, { datum: { $lte: until } }],
          $limit: 1000
        },
      })
      .then((result) => {
        return result.data.sort((a, b) => {
          const d1 = a.datum
          const d2 = b.datum
          let dx = d1.localeCompare(d2)
          if (dx === 0) {
            dx = a.zeit.localeCompare(b.zeit)
          }
          return dx
        })
      })
      .catch((err) => {
        alert(err)
      })
  }
}

export class EncounterModel {
  private bm: BillingsManager
  private km: KontaktManager
  private em: EncounterManager
  private billings: Array<BillingType>
  private utility: Service<any>
  private blob: Service<any>

  constructor(private enc: EncounterType) {
    this.bm = new BillingsManager()
    this.km = new KontaktManager()
    this.em = new EncounterManager()
    this.utility = getService("utility")
    this.blob = getService("blob")
  }

  private timeString(t: string) {
    return t.substring(0, 2) + ':' + t.substring(2, 4)
  }

  public get entity() {
    return this.enc
  }
  public async save() {
    await this.em.save(this.enc)
  }
  public async getLabel(): Promise<string> {
    const dat = DateTime.fromISO(this.enc.datum)
    const weekday = weekDaysShort[dat.weekday - 1]
    const sum = await this.getSum()
    return (
      weekday +
      ', ' +
      dat.toFormat(trl('formatting.date')) +
      ', ' +
      this.timeString(this.enc.zeit) +
      ' - ' +
      sum.round5().getFormatted(2)
    )
  }

  public async getBillings(reload: boolean = false): Promise<BillingType[]> {
    if (!this.billings || reload) {
      this.billings = await this.bm.getBillings(this.enc.id)
    }
    return this.billings
  }

  public async getSum(): Promise<Money> {
    if (!this.enc._Sum) {
      let sum = 0;
      for (const billing of await this.getBillings()) {
        const preis = parseFloat(billing.vk_preis)
        const num = parseFloat(billing.zahl)
        sum += preis * num
      }
      this.enc._Sum = new Money(sum)
    }
    return this.enc._Sum
  }

  public async getCase(): Promise<CaseType> {
    if (!this.enc._Fall) {
      if (this.enc.fallid) {
        this.enc._Fall = (await caseManager.fetch(this.enc.fallid)) as CaseType
      }
    }
    return this.enc._Fall
  }

  public async getPatient(): Promise<PatientType> {
    if (!this.enc._Patient) {
      const fall = await this.getCase()
      this.enc._Patient = await caseManager.getPatient(fall)
    }
    return this.enc._Patient
  }

  public async getMandator(): Promise<KontaktType> {
    if (!this.enc._Mandator) {
      this.enc._Mandator = (await this.km.fetch(
        this.enc.mandantid,
      )) as KontaktType
    }
    return this.enc._Mandator
  }

  /*
  public async getInvoice(): Promise<InvoiceType> {
    if (this.enc.rechnungsid) {
      if (!this.enc._Rechnung) {
        this.enc._Rechnung = await
      }
    }
  }
  */
  public getDateTime(): DateTime {
    const dat = DateTime.fromFormat(this.enc.datum, 'yyyyLLdd')
    const hrs = parseInt(this.enc.zeit.substring(0, 2))
    const mins = parseInt(this.enc.zeit.substring(2))
    dat.plus({ hours: hrs, minutes: mins })
    return dat
  }

  public async setInvoice(invoiceId: string) {
    this.enc.rechnungsid = invoiceId
    await this.em.save(this.enc)
  }


  public async getKonsText(): Promise<EncounterEntry> {
    let result: EncounterEntry = { html: "<p>Kein Eintrag</p>" };
    if (this.enc.eintrag) {
      if (this.enc.eintrag.html) {
        result = this.enc.eintrag
      } else {
        result = await this.utility.get("konsText", { query: { entry: this.enc.eintrag } })
      }
    }
    try {
      const blob = await this.blob.get(this.enc.id)
      if (blob.data) {
        if (typeof (blob.data == 'string')) {
          result.json = JSON.parse(blob.data)
        } else {
          result.json = blob.data
        }
      }
    }
    catch (err) {
      if (err.message !== "not_found") {
        alert(err)
      }
    }

    return result
  }

  public async setKonsText(contents: any) {
    const entry = {
      id: this.enc.id,
      datetime: this.enc.datum + "-" + (this.enc.zeit || "000000"),
      data: JSON.stringify(contents),
      pid: this.enc._Patient?.id
    }
    await this.blob.update(this.enc.id, entry)
  }
  public static getDefinition(): FlexformConfig {
    return {
      title: () => "",
      compact: true,
      attributes: [
        {
          attribute: "datum",
          label: trl('encounter.date'),
          datatype: "date"
        }

      ]
    }
  }
}

