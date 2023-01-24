/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID } from "./elexistype";
import { EncounterModel } from './encounter-model';
import { ObjectManager } from "./object-manager";
import { getService } from "../services/io";
import { Money } from './money';
import util from '../services/util'
import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'
import { userManager as um } from '.'
import type {UserType} from './user-model'
import type { PatientType } from './patient-model';
import type { FlexformConfig } from "../widgets/flexformtypes";
import type { EncounterType } from "./encounter-model";
import { currentUser } from "../services/store";
let trl
const unregister = _.subscribe((res) => (trl = res))
let actUser:UserType
currentUser.subscribe(u=>{actUser=u})
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
    if (obj) {
      const beginDate = obj.datumvon ? DateTime.fromISO(obj.datumvon).toLocaleString() : "?";
      let gesetz = obj.gesetz;
      if (!gesetz) {
        if (obj.extjson) {
          gesetz = obj.extjson.billing;
        }
      }
      return `${gesetz || "KVG?"}/${obj.grund}: ${beginDate} - ${obj.bezeichnung
        }`;
    } else {
      return "?"
    }
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

  public async createEncounterFor(c: CaseType): Promise<EncounterType> {
    const now = util.DateToElexisDateTime(new Date())
    const enc: EncounterType = {
      datum: now.substring(0, 8),
      zeit: now.substring(8),
      mandantid: (await um.getActiveMandatorFor(actUser)).id,
      fallid: c.id,
      rechnungsid: null,
      leistungen: null,
      eintrag: {
        remark: actUser.id,
        timestamp: now,
        html:"<p>-</p>"
      }
    }
    const entered = await this.encounterService.create(enc)
    return entered
  }
  public getBillingDate(obj: CaseType): Date {
    if (obj.betriebsnummer) {
      const dt = DateTime.fromISO(obj.betriebsnummer)
      if (dt.isValid) {
        return dt.toJSDate()
      }
    }
    return undefined
  }
  /**
   * Set date when this case was billed or should be billed
   * @param d
   */
  public setBillingDate(obj: CaseType, d: Date | string) {
    if (d) {
      let dt: DateTime
      if (d instanceof Date) {
        dt = DateTime.fromJSDate(d)
      } else {
        dt = DateTime.fromISO(d)
      }
      if (dt.isValid) {
        obj.betriebsnummer = dt.toFormat("yyyyLLdd")
      }
    } else {
      delete obj.betriebsnummer
    }
  }
}


export const FormDefinition: FlexformConfig = {
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

