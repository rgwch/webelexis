/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */


import {bindable,Container} from "aurelia-framework";
import {Slot} from "../models/slot";
import {FHIRobject} from "../models/fhirobj";
import {Config} from '../config'

export class SlotView {
  @bindable obj:FHIRobject
  @bindable large:Boolean
  private cfg

  constructor() {
    this.cfg = Container.instance.get(Config)
  }

  getLabel() {
    if (this.large) {
      console.log(this.large)
    }
    if (this.obj && this.obj.fhir) {
      let fhir = this.obj.fhir
      return `${fhir.id} - ${this.obj.getTimeField('start')} - ${this.obj.getTimeField('end')}; ${fhir['freeBusyType']}`
    }
  }

  getTypeStyle() :string{
    let freebusy = this.obj.getField('freeBusyType')
    let type={}
    if(freebusy=="free") {
      type = this.cfg.getAgendaType("free")
    }else{
      type= this.cfg.getAgendaType(this.obj.getField("contained.type.text"))
    }
    let ret
    if(type["bg"]){
      ret="background-color:"+type['bg']+";"
    }
    if(type["fg"]){
      ret+="color:"+type["fg"]+";"
    }
    return ret;
  }

}