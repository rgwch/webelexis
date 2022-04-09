/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID, DATE } from './elexistype';
import { getService } from "../services/io";
import type { IService } from '../services/io'
import type { CaseType } from "./case-model";
import type { KontaktType } from "./kontakt-model";
import { DateTime } from 'luxon';

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
  rnstatus: string    // InvoiceState
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
  selected?: boolean
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

export const RnState = {
  OPEN: "4",
  OPEN_AND_PRINTED: "5",
  DEMAND_NOTE: "6",
  DEMAND_NOTE_PRINTED: "7",
  DEMAND_NOTE_2: "8",
  DEMAND_NOTE_2_PRINTED: "9",
  DEMAND_NOTE_3: "10",
  DEMAND_NOTE_3_PRINTED: "11",
  IN_EXECUTION: "12",
  PARTIAL_LOSS: "13",
  TOTAL_LOSS: "14",
  PARTIAL_PAYMENT: "15",
  PAID: "16",
  EXCESSIVE_PAYMENT: "17",
  CANCELLED: "18"
}

export class Invoice {
  constructor(private bill: InvoiceType) { }

  public async setInvoiceState(level: string): Promise<boolean> {
    try {
      const billService: IService<InvoiceType> = getService("bills")
      const result: InvoiceType = await billService.patch(this.bill.id, { rnstatus: level, statusdatum: DateTime.now().toFormat("yyyyLLdd") }) as InvoiceType
      if (result && (result.rnstatus == level)) {
        return true
      } else {
        return false;
      }

    } catch (err) {
      console.log(err)
      return false;
    }
  }
  public async print(toPrinter: boolean): Promise<boolean> {
    try {
      const printer: IService<InvoiceType> = getService("invoice")
      const billService: IService<InvoiceType> = getService("bills")
      this.bill.output = toPrinter
      const ret = await printer.create(this.bill)
      if (ret) {
        switch (this.bill.rnstatus) {
          case RnState.OPEN: this.bill.rnstatus = RnState.OPEN_AND_PRINTED; break;
          case RnState.DEMAND_NOTE: this.bill.rnstatus = RnState.DEMAND_NOTE_PRINTED; break;
          case RnState.DEMAND_NOTE_2: this.bill.rnstatus = RnState.DEMAND_NOTE_2_PRINTED; break;
          case RnState.DEMAND_NOTE_3: this.bill.rnstatus = RnState.DEMAND_NOTE_3_PRINTED; break;
        }
        this.bill.statusdatum = DateTime.fromJSDate(new Date()).toFormat("yyyyLLdd");
        const modified = await billService.update(this.bill.id, this.bill)
        return true
      }
      return false;
    } catch (err) {
      console.log(err)
      return false;
    }
  }

}

