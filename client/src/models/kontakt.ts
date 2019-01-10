/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Container } from "aurelia-framework";
import { DateTime } from "../services/datetime";
import { ElexisType, UUID } from "./elexistype";

/**
 * An Elexis "Kontakt"
 */
export interface KontaktType extends ElexisType {
  id: UUID;
  Bezeichnung1: string;
  Bezeichnung2?: string;
  Bezeichnung3?: string;
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
  natel?: string;
  email?: string;
}

export class Kontakt {

  public static getLabel = (raw: KontaktType) => {
    let d = raw.geburtsdatum || "";
    if (d.length == 8) {
      d = Kontakt.dt.ElexisDateToLocalDate(d);
    }
    let ret = raw.Bezeichnung1 + " " + (raw.Bezeichnung2 || "");
    if (raw.geschlecht) {
      ret += `(${raw.geschlecht})`;
    }
    if (d) {
      ret += ", " + d;
    }
    return ret;
  };
  private static dt = Container.instance.get(DateTime);
}
