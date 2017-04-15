/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {bindable} from "aurelia-framework";
/**
 * An Input that can be locked
 */
export class LockableInput{
  @bindable value:string
  @bindable label:string
  @bindable locked:boolean

}
