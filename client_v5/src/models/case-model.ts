/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID } from "./elexistype";
import { ObjectManager } from "./object-manager";
import { getService } from "../services/io";
import type { ServiceType } from './../services/io';
import { DateTime } from 'luxon'
import type { PatientType } from './patient-model';

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

  private patientService

  constructor() {
    super("fall");
    this.patientService = getService("patient");
  }

  /**
   * Fetch all cases for a given patient
   * @param id UUID of the patient
   */
  public async loadCasesFor(id: UUID) {
    const result = await this.dataService.find({ query: { patientid: id } });
    if (result && result.data) {
      return result.data;
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
  public getLabel(obj: CaseType) {
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
}

export class CaseModel {
  constructor(private obj: CaseType) { }

  public get id() {
    return this.obj.id
  }

  public getBillingate(): Date {
    if (this.obj.betriebsnummer) {
      const dt = DateTime.fromISO(this.obj.betriebsnummer)
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
}