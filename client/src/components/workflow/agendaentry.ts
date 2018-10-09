import { WebelexisEvents } from './../../webelexisevents';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, autoinject, computedFrom } from 'aurelia-framework'
import { TerminType, TerminModel, Statics } from '../../models/termine-model'
import { Kontakt } from '../../models/kontakt'
import { DateTime } from '../../services/datetime'
import * as _ from 'lodash'
import { TerminManager } from './../../models/termine-model';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RightPanel } from './../../routes/dispatch/right';
import { LeftPanel } from './../../routes/dispatch/left';

/**
 * A single Agenda entry. Type can be 'free', 'reserved' or any one of the user defined types.
 */
@autoinject
export class AgendaEntry {
  @bindable entry: TerminModel
  @bindable index: number
  showmenu = false
  maxLen = 50;
  detailVisible: boolean = false
  termintypen = []
  terminstaten = []



  constructor(private dt: DateTime, private tm: TerminManager,
    private ea: EventAggregator, private we: WebelexisEvents) {
  }

  attached() {
    this.termintypen = Statics.terminTypes
    this.terminstaten = Statics.terminStates
  }

  showDetail() {
    this.detailVisible = !this.detailVisible
  }

  select(view, list) {
    const patient = this.entry.obj.kontakt
    patient.type = "patient"
    this.we.selectItem(patient)
    if (list) {
      this.ea.publish(LeftPanel.message, list)
    }
    this.ea.publish(RightPanel.message, view)
  }

  isStaticType() {
    return this.entry.isFree() || this.entry.isReserved()
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
    return this.entry.getLabel()
  }

  rawContents() {
    return this.entry.rawContents()
  }

  get types() {
    return Statics.terminTypes
  }

  save() {
    this.tm.save(this.entry)
  }
  changeState() {
    const actState = this.entry.obj.TerminStatus
    let index = _.findIndex(Statics.terminStates, e => e === actState)
    if (index > Statics.terminStates.length) {
      index = 0;
    } else {
      index++;
    }
    this.entry.obj.TerminStatus = Statics.terminStates[index]
  }
  toggleMenu() {
    this.showmenu = !this.showmenu
  }

  get menu() {
    if (this.entry.obj.TerminTyp == Statics.terminTypes[0]) {
      return []
    } else if (this.entry.obj.TerminTyp == Statics.terminTypes[1]) {
      return []
    } else {
      return Statics.terminStates
    }
  }

}
