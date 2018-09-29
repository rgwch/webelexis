/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { CaseType } from './case';
import { KontaktType } from './kontakt';
import {ElexisType} from './elexistype'

/**
 * An Elexis "Konsultation"
 */
export interface EncounterType extends ElexisType{
  datum: Date,
  mandator: KontaktType|string,
  case: CaseType|string,
  eintrag: {
    remark: string,     // Editor of last modification
    html?: string,
    delta?: string,
    timestamp: string   // Date of last modification
  }
}

