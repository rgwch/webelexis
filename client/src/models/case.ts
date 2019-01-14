/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { DateTime } from './../services/datetime';
import { CaseType } from './case';
import { PatientType } from './patient';
import { KontaktType } from './kontakt';
import { autoinject, Container } from 'aurelia-framework';
import { DataSource, DataService } from '../services/datasource';
import { I18N } from 'aurelia-i18n';
import { ElexisType, UUID } from './elexistype';

const i18 = Container.instance.get(I18N)
/**
 * An Elexis "Fall"
 */
export interface CaseType extends ElexisType {
  guarantor: KontaktType | UUID
  patient: PatientType | UUID
  bezeichnung: string
  grund: "Krankheit" | "Unfall" | "Mutterschaft"
  gesetz: string
  datumvon: string
  datumbis?: string
  extinfo?: any
  extjson?: any
}

@autoinject
export class CaseManager {   // sic!
  private caseService: DataService

  constructor(private ds: DataSource, private dt: DateTime) {
    this.caseService = ds.getService('fall')
  }

  public async loadCasesFor(id: UUID) {
    const result = await this.caseService.find({ query: { patientid: id } })
    if (result && result.data) {
      return result.data
    }
  }

  public getLabel(obj: CaseType) {
    const beginDate = this.dt.ElexisDateToLocalDate(obj.datumvon)
    let gesetz = obj.gesetz
    if (!gesetz) {
      if (obj.extjson) {
        gesetz = obj.extjson.billing
      }
    }
    return `${gesetz || "KVG?"}/${obj.grund}: ${beginDate} - ${obj.bezeichnung}`
  }
}

@autoinject
export class CaseModel {
  constructor(private obj: CaseType) { }

}
