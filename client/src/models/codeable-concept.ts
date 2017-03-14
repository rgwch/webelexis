/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIR_CodeableConcept, FHIR_Coding} from './fhir'
export class CodeableConcept {
  constructor(private fhir: FHIR_CodeableConcept) {}

  getCodings(): Array<FHIR_Coding> {
    return this.fhir.coding
  }

  /**
   return a human readable label for this CodeableConcept: If one of the contained codings
   is userSelected, then use that coding's display. Else use the 'text' attribute of the
   CodeableConcept. If neither returns a readable value, return the string "undefined"
   */
  public getLabel() {
    let deflt = this.getCodings().find(function (elem) {return elem.userSelected == true})
    let label = "undefined"
    if (typeof deflt == 'undefined' || typeof(deflt.display == 'undefined')) {
      label = this.fhir.text
    } else {
      label = deflt.display
    }
    return label
  }
}
