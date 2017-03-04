/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {FHIR_Resource} from '../../common/models/fhir'

export interface Refiner {
  dataType:string
  compare(a:FHIR_Resource,b:FHIR_Resource): number
  fetchSQL(params:{}):Promise<Array<FHIR_Resource>>
  fetchNoSQL(params):Promise<Array<FHIR_Resource>>
  pushSQL(fhir:FHIR_Resource):Promise<void>
}
