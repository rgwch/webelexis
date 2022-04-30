/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { CaseManager } from './case-model'
import type { CaseType } from './case-model'
import type { ElexisType, UUID } from './elexistype'
import type { PatientType } from './patient-model'
import type { KontaktType } from './kontakt-model'
import { KontaktManager } from './kontakt-model'
import { ObjectManager } from './object-manager'
import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'
import { weekDaysShort } from './timedate'
import type { BillingModel } from './billings-model'
import { BillingsManager } from './billings-model'
import { getService } from '../services/io'
import { Money } from './money'
import type { FlexformConfig } from '../widgets/flexformtypes'

let trl
const un = _.subscribe((res) => {
  trl = res
})

/**
 * An Elexis "Konsultation"
 */
export interface EncounterType extends ElexisType {
  datum: string // YYYYMMDD
  zeit: string // HH:mm:ss
  mandantid: UUID // UUIDv4 (36) or ElexisID (25)
  fallid: UUID // UUIDv4 (36) or ElexisID (25)
  rechnungsid?: UUID // UUIDv4 (36) or ElexisID (25)
  leistungen?: string // usually null
  eintrag: {
    remark: string // Editor of last modification
    html?: string // HTML Version of the entrytext
    timestamp: string // Date of last modification
  }
  _Patient?: any
  _Fall?: CaseType
  _Mandator?: KontaktType
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
  public fetchFor(
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
  private cm: CaseManager
  private km: KontaktManager
  private em: EncounterManager
  private billings: Array<BillingModel>

  constructor(private enc: EncounterType) {
    this.bm = new BillingsManager()
    this.cm = new CaseManager()
    this.km = new KontaktManager()
    this.em = new EncounterManager()
  }

  private timeString(t: string) {
    return t.substring(0, 2) + ':' + t.substring(2, 4)
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

  public async getBillings(reload: boolean = false): Promise<BillingModel[]> {
    if (!this.billings || reload) {
      this.billings = await this.bm.getBillings(this.enc.id)
    }
    return this.billings
  }

  public async getSum(): Promise<Money> {
    let sum = 0
    for (const billing of await this.getBillings()) {
      const b = billing.getBilling()
      const preis = parseFloat(b.vk_preis)
      const num = parseFloat(b.zahl)
      sum += preis * num
    }
    return new Money(sum)
  }

  public async getCase(): Promise<CaseType> {
    if (!this.enc._Fall) {
      if (this.enc.fallid) {
        this.enc._Fall = (await this.cm.fetch(this.enc.fallid)) as CaseType
      }
    }
    return this.enc._Fall
  }

  public async getPatient(): Promise<PatientType> {
    if (!this.enc._Patient) {
      const fall = await this.getCase()
      this.enc._Patient = await this.cm.getPatient(fall)
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
  public getDateTime(): DateTime {
    const dat = DateTime.fromFormat(this.enc.datum, 'yyyyLLdd')
    const hrs = parseInt(this.enc.zeit.substring(0, 2))
    const mins = parseInt(this.enc.zeit.substring(2))
    dat.plus({ hours: hrs, minutes: mins })
    return dat
  }

  public async setInvoice(invoideId: string) {
    this.enc.rechnungsid = invoideId
    await this.em.save(this.enc)
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
