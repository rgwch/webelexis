/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {bindable} from "aurelia-framework";
import {FHIR_Resource} from "../models/fhir";

/**
 * Display Communincation Elements of FHIR_Patients
 */
export class CommBox {
  @bindable patient: FHIR_Resource
}
