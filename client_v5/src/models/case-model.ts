import { EncounterModel } from './encounter-model';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID } from "./elexistype";
import { ObjectManager } from "./object-manager";
import { getService } from "../services/io";
import { Money } from './money';

import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'
import type { PatientType } from './patient-model';
import type { FlexformConfig } from "../widgets/flexformtypes";
import type { EncounterType } from "./encounter-model";
import { empty } from "svelte/internal";
let trl
const unregister = _.subscribe((res) => (trl = res))
/**
 * An Elexis "Fall"
 */
export interface CaseType extends ElexisType {
  garantid: UUID;
  patientid: UUID;
  kostentrid: UUID;
  bezeichnung: string;
  betriebsnummer: string;
  grund: "Krankheit" | "Unfall" | "Mutterschaft";
  gesetz: string;
  datumvon: string;
  datumbis?: string;
  extinfo?: any;
  extjson?: any;
  _Patient?: PatientType
}

export class CaseManager extends ObjectManager {
  private encounterService
  private patientService

  constructor() {
    super("fall");
    this.patientService = getService("patient");
    this.encounterService = getService('konsultation')
  }

  /**
   * Fetch all cases for a given patient
   * @param id UUID of the patient
   */
  public async loadCasesFor(id: UUID): Promise<Array<CaseType>> {
    const result = await this.dataService.find({ query: { patientid: id } });
    if (result && result.data) {
      return result.data;
    } else {
      return []
    }
  }

  public async save(fall: CaseType) {
    delete fall._Patient;
    if (fall.id) {
      return await this.dataService.update(fall.id, fall);
    } else {
      return await this.dataService.create(fall);
    }
  }
  public async getPatient(fall: CaseType) {
    if (!fall._Patient) {
      if (fall.patientid) {
        fall._Patient = await this.patientService.get(fall.patientid);
      }
    }
    return fall._Patient;
  }
  public getLabel(obj: CaseType): string {
    const beginDate = DateTime.fromISO(obj.datumvon).toLocaleString();
    let gesetz = obj.gesetz;
    if (!gesetz) {
      if (obj.extjson) {
        gesetz = obj.extjson.billing;
      }
    }
    return `${gesetz || "KVG?"}/${obj.grund}: ${beginDate} - ${obj.bezeichnung
      }`;
  }
  public async getUnbilledAmount(obj: CaseType): Promise<Money> {
    const result = await this.encounterService.find({ query: { fallid: obj.id, rechnungsid: 'null' } })
    if (result) {
      let ret = new Money(0)
      for (const k of result.data) {
        const enc = new EncounterModel(k)
        ret = ret.add(await enc.getSum())
      }
      return ret;
    }
    return new Money(-10)
  }

  public async getEncounters(obj: CaseType): Promise<EncounterType[]> {
    const result = await this.encounterService.find({ query: { fallid: obj.id } })
    return result.data
  }
}

export class CaseModel {
  constructor(private obj: CaseType) { }

  public get id() {
    return this.obj.id
  }

  public getBillingDate(): Date {
    if (this.obj.betriebsnummer) {
      const dt = DateTime.fromISO(this.obj.betriebsnummer)
      if (dt.isValid) {
        return dt.toJSDate()
      }
    }
    return undefined
  }

  public getUnbilledAmount(): Money {
    let amount = new Money(0)

    return amount
  }
  /**
   * Set date when this case was billed or should be billed
   * @param d
   */
  public setBillingDate(d: Date | string) {
    if (d) {
      let dt: DateTime
      if (d instanceof Date) {
        dt = DateTime.fromJSDate(d)
      } else {
        dt = DateTime.fromISO(d)
      }
      if (dt.isValid) {
        this.obj.betriebsnummer = dt.toFormat("yyyyLLdd")
      }
    } else {
      delete this.obj.betriebsnummer
    }
  }
  public static getDefinition(): FlexformConfig {
    return {
      title: () => "",
      compact: true,
      attributes: [
        {
          attribute: "datumvon",
          label: trl('case.begindate'),
          datatype: "date",
          sizehint: 6
        },
        {
          attribute: "datumbis",
          label: trl('case.enddate'),
          datatype: "date",
          sizehint: 6
        },
        {
          attribute: "grund",
          label: trl("case.reason"),
          datatype: "string",
        }, {
          attribute: "bezeichnung",
          label: trl('case.description'),
          datatype: "string"
        }

      ],
    }
  }
}
