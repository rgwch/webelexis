/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { EmptyAdapter } from './empty-adapter';
import { PatientAdapter } from "./patient-adapter";

export class AdapterFactory {
  public static create(datatype: string) {
    switch (datatype) {
      case "patient": return new PatientAdapter()
      default: return new EmptyAdapter()
    }
  }
}
