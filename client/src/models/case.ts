import { DateTime } from './../services/datetime';
import { CaseType } from './case';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { PatientType } from './patient';
import { KontaktType } from './kontakt';
import { autoinject } from 'aurelia-framework';
import { DataSource, DataService } from '../services/datasource';
import * as moment from 'moment'

/**
 * An Elexis "Fall"
 */
export interface CaseType {
  guarantor: KontaktType | string
  patient: PatientType | string
  bezeichnung: string
  grund: "Krankheit"|"Unfall"|"Mutterschaft"
  gesetz: string
  datumvon: string
  datumbis: string
  id: string
}

@autoinject
export class CaseManager {   // sic!
  private caseService: DataService

  constructor(private ds: DataSource, private dt:DateTime) {
    this.caseService = ds.getService('fall')
  }

  async loadCasesFor(id:string) {
    const result = await this.caseService.find({ query: { patientid: id } })
    if (result && result.data) {
      return result.data
    }
  }

  getLabel(obj:CaseType){
    const beginDate=this.dt.ElexisDateToLocalDate(obj.datumvon)
    return `${obj.gesetz}/${obj.grund}: ${beginDate} - ${obj.bezeichnung}`
  }
}

export class CaseModel {
  obj: CaseType
  constructor(obj: CaseType) {
    this.obj = obj
  }

  
}
