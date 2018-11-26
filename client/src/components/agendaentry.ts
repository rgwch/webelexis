/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from '../webelexisevents';
import { bindable, autoinject, computedFrom } from 'aurelia-framework'
import { TerminType, TerminModel, Statics } from '../models/termine-model'
import { Kontakt } from '../models/kontakt'
import { DateTime } from '../services/datetime'
import * as _ from 'lodash'
import { TerminManager } from '../models/termine-model';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RightPanel } from '../routes/dispatch/right';
import { LeftPanel } from '../routes/dispatch/left';

/*
 We use local styles here to avoid pollution of the global namespace
 */
import 'styles/blind.css'
import 'styles/slider.css'

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
  selectedTyp
  selectedState

  constructor(private dt: DateTime, private tm: TerminManager,
    private ea: EventAggregator, private we: WebelexisEvents) {
  }
  
  bind(context) {
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

  save() {
    this.tm.save(this.entry).then(saved=>{
      if(saved.id!==this.entry.obj.id){
        alert("error while saving")
      }
    }).catch(err=>{
      alert("exception while saving: "+err)
    })
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
  /**
   * from UI button: Reduce duration of appointmen
   */
  shorten(){
    const raw=this.entry.obj.Dauer/2
    this.entry.obj.Dauer=5*Math.floor(raw/5)
    
    this.tm.save(this.entry)
  }
  /**
   * from UI button: Enlarge duration of appointment
   */
  enlarge(){
    this.tm.getNext(this.entry).then(nxt=>{
      if(nxt){
        const maxDuration=nxt.getBeginMinutes()-this.entry.getBeginMinutes()
        this.entry.setDuration(Math.min(this.entry.getDuration()*2,maxDuration))
        this.tm.save(this.entry)
      }
    })
  
  }
  /**
   * from UI button: delete appointment
   */
  delete(){
   this.tm.delete(this.entry) 
  }
}
