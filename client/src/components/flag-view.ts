/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIRobject} from "../models/fhirobj";
import {bindable} from "aurelia-framework";
/**
 * Display a FHIR_Flag
 */
export class FlagView {
  @bindable flag: FHIRobject
  @bindable large: boolean = false

  largeToggle() {
    this.large = !this.large

  }
}
