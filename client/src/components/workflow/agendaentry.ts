/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, autoinject, computedFrom} from 'aurelia-framework'
import { TerminType, Termin } from '../../models/termin'
import { Kontakt } from '../../models/kontakt'
import {DateTime}from '../../services/datetime'
import {Globals} from '../../global'
import * as _ from 'lodash'
import { isThisTypeNode } from 'typescript';

@autoinject
export class AgendaEntry {
  @bindable entry: TerminType
  @bindable index: number
  showmenu=false
  maxLen=50;


  constructor(private dt: DateTime, private globals:Globals) {
  }

  attached(){
  }

  get typecss(){
    let style= `background-color:${this.globals.getAgendaTypColorFor(this.entry.TerminTyp)};`
    return style
   }

   get statecss(){
    let style= `background-color:${this.globals.getAgendaStateColorFor(this.entry.TerminStatus)};`
     return  style
   }
  getTimes() {
    let ret:string = this.dt.minutesToTimeString(parseInt(this.entry.Beginn))
    let end:number=parseInt(this.entry.Beginn)+parseInt(this.entry.Dauer)
    return ret+"-"+this.dt.minutesToTimeString(end)
  }
  getLabel() {
    return Termin.getLabel(this.entry)
  }

  get states(){
    return _.keys(this.globals.agendaStateColors)
  }

  get types(){
    return _.keys(this.globals.agendaTypColors)
  }
  changeState(){
    const actState=this.entry.TerminStatus
    let index=_.findIndex(this.states,e=>e===actState)
    if(index>this.states.length){
      index=0;
    }else{
      index++;
    }
    this.entry.TerminStatus=this.states[index]
  }
  toggleMenu(){
    this.showmenu=!this.showmenu
  }

  get menu(){
    if(this.entry.TerminTyp == this.types[0]){
      return []
    }else if(this.entry.TerminTyp == this.types[1]){
      return []
    }else{
      return this.states
    }
  }
}
