/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType, UUID } from "./elexistype";
import { ObjectManager } from './object-manager'
import { DateTime } from 'luxon'

/**
 * An Elexis "Kontakt"
 */
export interface KontaktType extends ElexisType {
  id: UUID;
  bezeichnung1: string;
  bezeichnung2?: string;
  bezeichnung3?: string;
  geburtsdatum?: string;
  istperson?: string;
  istanwender?: string;
  istmandant?: string;
  istorganisation?: string;
  geschlecht?: "m" | "f" | "w" | "?";
  strasse?: string;
  plz?: string;
  ort?: string;
  telefon1?: string;
  telefon2?: string;
  titel?: string
  titelsuffix?: string
  natelnr?: string;
  email?: string;
  bemerkung?: string;
  extjson?: any
}

export class KontaktManager extends ObjectManager {
  constructor() {
    super("kontakt")
  }
}
export class KontaktModel {

  constructor(private obj: KontaktType) {

  }

  public getLabel = () => {
    let d = this.obj.geburtsdatum || "";
    if (d.length === 8) {
      d = DateTime.fromFormat(d, 'yyyyLLdd').toFormat("dd.LL.yyyy")
    }
    let ret = this.obj.bezeichnung1 + " " + (this.obj.bezeichnung2 || "");
    if (this.obj.geschlecht) {
      ret += `(${this.obj.geschlecht})`;
    }
    if (d) {
      ret += ", " + d;
    }
    return ret;
  };
}
