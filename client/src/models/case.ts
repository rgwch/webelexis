/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { PatientType } from './patient';
import { KontaktType } from './kontakt';

/**
 * An Elexis "Fall"
 */
export interface CaseType{
  guarantor: KontaktType|string,
  patient: PatientType|string,
  startDate: Date,
  endDate: Date,
  id: string
}

export class CaseManager{   // sic!


}

export class CaseModel{

}
