/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIR_Resource} from "../models/fhir";
import {bindable} from "aurelia-framework";

export class DocumentView{
  @bindable document: FHIR_Resource
}