/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { CaseType, CaseManager } from './case-model'
import type { ElexisType, UUID } from './elexistype'
import { ObjectManager } from './object-manager'
import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'
import { weekDaysShort } from './timedate'

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
}

export class EncounterManager extends ObjectManager {
  private trl
  constructor() {
    super('konsultation')
    const un = _.subscribe(res => this.trl = res)
  }

  private timeString(t: string) {
    return t.substring(0, 2) + ':' + t.substring(2, 4)
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

  /*
  public async getCase(enc: EncounterType): Promise<CaseType> {
    if (!enc._Fall) {
      if (enc.fallid) {
        enc._Fall = await this.cm.fetch(enc.fallid)
      }
    }
    return enc._Fall
  }

  public async getPatient(enc: EncounterType): Promise<PatientType> {
    if (!enc._Patient){
      const fall = await this.getCase(enc)
      enc._Patient = await this.cm.getPatient(fall)
    }
    return enc._Patient
  }
*/
  public getLabel(enc: EncounterType) {
    const dat = DateTime.fromISO(enc.datum)
    const weekday = weekDaysShort[dat.weekday - 1]
    return (
      weekday + ", " + dat.toFormat(this.trl("formatting.date")) +
      ', ' +
      this.timeString(enc.zeit)
    )
  }

  /*
  public getBillings(enc: EncounterType): Promise<BillingModel[]>{
    return this.bm.getBillings(enc)
  }
  */
}
