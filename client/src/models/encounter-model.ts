/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { CaseType, CaseManager } from "./case";
import { KontaktType } from "./kontakt";
import { ElexisType, UUID } from "./elexistype";
import * as moment from "moment";
import { autoinject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { DateTime } from "services/datetime";
import { DataSource, DataService } from "services/datasource";
import { deepEqual } from "assert";
import { PatientType, Patient } from "./patient";
import { ObjectManager } from "./object-manager";
import { BillingModel, BillingsManager } from "./billings-model";

/**
 * An Elexis "Konsultation"
 */
export interface EncounterType extends ElexisType {
  datum: string; // YYYYMMDD
  zeit: string; // HH:mm:ss
  mandantid: UUID; // UUIDv4 (36) or ElexisID (25)
  fallid: UUID; // UUIDv4 (36) or ElexisID (25)
  rechnungsid?: UUID; // UUIDv4 (36) or ElexisID (25)
  leistungen?: string; // usually null
  eintrag: {
    remark: string; // Editor of last modification
    html?: string; // HTML Version of the entrytext
    timestamp: string; // Date of last modification
  };
  _Patient?: PatientType;
  _Fall?: CaseType;
}

@autoinject
export class EncounterManager extends ObjectManager{

  constructor(private dt: DateTime, private cm: CaseManager, private bm: BillingsManager) {
    super("konsultation")
  }

  public fetchFor(
    dateFrom: string,
    dateUntil: string,
    mandant: UUID
  ): Promise<EncounterType[]> {
    const from = moment(dateFrom).format("YYYYMMDD");
    const until = moment(dateUntil).format("YYYYMMDD");

    return this.dataService
      .find({
        query: {
          $and: [{ datum: { $gte: from } }, { datum: { $lte: until } }]
        }
      })
      .then(result => {
        return result.data.sort((a, b) => {
          const d1 = a.datum;
          const d2 = b.datum;
          let dx = d1.localeCompare(d2);
          if (dx === 0) {
            dx = a.zeit.localeCompare(b.zeit);
          }
          return dx;
        });
      })
      .catch(err => {
        alert(err);
      });
  }

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

  public getLabel(enc: EncounterType) {
    return this.dt.ElexisDateToLocalDate(enc.datum) + "," + enc.zeit;
  }

  public getBillings(enc: EncounterType): Promise<BillingModel[]>{
    return this.bm.getBillings(enc)
  }
}
