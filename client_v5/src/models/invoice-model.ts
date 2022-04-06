/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID, DATE } from './elexistype';
import { getService } from "../services/io";
import type { CaseType } from "./case-model";
import type { KontaktType } from "./kontakt-model";
/*
export interface Kontakt {
  id: string
  bezeichnung1: string
  bezeichnung2: string
  bezeichnung3: string
  geburtsdatum: string
  patientnr: string
  geschlecht: "m" | "f"
  titel: string
  strasse: string
  plz: string
  ort: string
  email: string
  anschrift: string
  bemerkung: string
  deleted: string
  lastupdate: number
  extinfo: Uint8Array

}
export interface Fall {
  id: string
  patientid: string
  patient?: Kontakt
  garantid: string
  garant?: Kontakt
  kostentrid: string
  kostentraeger: Kontakt
  versnummer: string
  fallnumme: string
  betriebsnummer: string
  diagnosen: string
  datumvon: string
  datumbis: string
  bezeichnuns: string
  grund: string
  gesetz: string
  extinfo: Uint8Array
  status: string
  deleted: string
  lastupdate: number

}
*/
export interface InvoiceType extends ElexisType {
  id?: UUID
  deleted?: string
  lastupdate?: number
  rnnummer: string
  fallid?: UUID
  mandantid?: UUID
  rndatum: DATE
  rnstatus: InvoiceState
  rndatumvon: DATE
  rndatumbis: DATE
  statusdatum: DATE
  betrag: string
  extinfo?: Uint8Array
  extjson?: any
  _Fall?: CaseType
  _Mandant?: KontaktType
  _Patname?: String
  output?: boolean
}

export enum InvoiceState {
  OPEN = 4,
  OPEN_AND_PRINTED,
  DEMAND_NOTE,
  DEMAND_NOTE_PRINTED,
  DEMAND_NOTE_2,
  DEMAND_NOTE_2_PRINTED,
  DEMAND_NOTE_3,
  DEMAND_NOTE_3_PRINTED,
  IN_EXECUTION,
  PARTIAL_LOSS,
  TOTAL_LOSS,
  PARTIAL_PAYMENT,
  PAID,
  EXCESSIVE_PAYMENT,
  CANCELLED
}

export class Invoice {
  constructor(private bill) { }

  public async print(toPrinter: boolean): Promise<boolean> {
    const printer = getService("invoice")
    this.bill.output = toPrinter
    const ret = await printer.create(this.bill)
    return ret
  }

}

