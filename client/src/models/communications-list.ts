/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import{FHIR_ContactPoint} from "./fhir"
import {Validator} from "../services/validator"

export class CommunicationList {
  fhir: Array<FHIR_ContactPoint>

  constructor(raw: Array<FHIR_ContactPoint>) {
    if (raw == undefined || raw == null || !(raw instanceof Array)) {
      this.fhir = []
    } else {
      this.fhir = raw.sort(function (a, b) {
        var ra = a["rank"]
        var rb = b["rank"]
        if (isNaN(ra)) {
          if (isNaN(rb)) {
            return 0
          } else {
            return 1
          }
        } else if (isNaN(rb)) {
          return -1
        } else {
          return ra - rb
        }
      })
    }
  }

  /**
   * return preferred contact method
   * @returns preferred or empty contact
   */
  getPreferred() {
    if (this.fhir.length == 0) {
      return {}
    } else {
      return this.fhir[0]
    }
  }


  /**
   * return home phone or empty contact if no such phone is found
   */
  homePhone() {
    this.fhir.forEach(contact => {
      if (Validator.getString(contact, "system") === "phone" &&
        Validator.getString(contact, "use") === "home") {
        return contact
      }
    })
    return {}
  }

  /**
   * return preferred phone or empty contact
   */
  phone() {
    var ret = this.fhir.filter(contact => {
      if (contact["system"] === "phone") {
        return true
      }
    })
    return ret.length == 0 ? {} : ret[0]
  }

  /**
   * return preferred mail
   */
  mail() {
    this.fhir.forEach(contact => {
      if (contact["system"] === ("mail" as string)) {
        return contact
      }
    })
    return {}
  }
}
