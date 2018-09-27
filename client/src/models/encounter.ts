import { CaseType } from './case';
import { KontaktType } from './kontakt';
import {ElexisType} from './elexistype'

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

