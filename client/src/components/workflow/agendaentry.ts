/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, autoinject, computedFrom } from 'aurelia-framework'
import { TerminType, TerminModel } from '../../models/termine-model'
import { Kontakt } from '../../models/kontakt'
import { DateTime } from '../../services/datetime'
import * as _ from 'lodash'
import { TerminManager } from './../../models/termine-model';

@autoinject
export class AgendaEntry {
  @bindable entry: TerminModel
  @bindable index: number
  showmenu = false
  maxLen = 50;


  constructor(private dt: DateTime, private tm: TerminManager) {
  }


  get typecss() {
    let style = `background-color:${this.entry.getTypColor()};`
    return style
  }

  get statecss() {
    let style = `background-color:${this.entry.getStateColor()};`
    return style
  }
  getTimes() {
    let ret: string = this.entry.getStartTime().format("HH:mm")
    let end = this.entry.getEndTime().format("HH:mm")
    return ret + "-" + end
  }
  getLabel() {
    console.log(this.entry)
    return this.entry.getLabel()
  }

  get states() {
    return this.tm.terminStates
  }

  get types() {
    return this.tm.terminTypes
  }

  changeState() {
    const actState = this.entry.obj.TerminStatus
    let index = _.findIndex(this.states, e => e === actState)
    if (index > this.states.length) {
      index = 0;
    } else {
      index++;
    }
    this.entry.obj.TerminStatus = this.states[index]
  }
  toggleMenu() {
    this.showmenu = !this.showmenu
  }

  get menu() {
    if (this.entry.obj.TerminTyp == this.types[0]) {
      return []
    } else if (this.entry.obj.TerminTyp == this.types[1]) {
      return []
    } else {
      return this.states
    }
  }
}
