/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIR_Resource} from "../models/fhir";
import {bindable} from "aurelia-framework";

/**
 * Show a slider box with a field for each address
 */
export class AddressBox {
  @bindable patient: FHIR_Resource
  private slider

  bind(context, over) {
    this.slider.pause()
    this.slider.height = "100px"
  }
}
