/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */


import {bindable} from "aurelia-framework";
import {Slot} from "../models/slot";

export class SlotView{
  @bindable slot:Slot
}