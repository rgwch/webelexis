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
  datum: string       // YYYYMMDD
  Zeit:string         // HH:mm:ss
  mandantid: string   // UUIDv4 (36) or ElexisID (25)
  fallid: string      // UUIDv4 (36) or ElexisID (25)
  rechnungsid?:string  // UUIDv4 (36) or ElexisID (25)
  leistungen?:string
  eintrag: {
    remark: string,     // Editor of last modification
    html?: string,      // HTML Version of the entrytext
    delta?: string,     // Delta Versiob of the entrytext
    timestamp: string   // Date of last modification
  }
}

