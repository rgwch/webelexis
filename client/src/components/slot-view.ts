/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */


import {bindable,Container} from "aurelia-framework";
import {Slot} from "../models/slot";
import {FHIRobject} from "../models/fhirobj";
import {Config} from '../config'
import {FhirService} from '../services/fhirservice'
import {FHIR_Resource} from "../models/fhir";
import {Patient} from "../models/patient";

export class SlotView {
  @bindable obj:FHIRobject
  @bindable large:Boolean
  private cfg
  private _state
  private _slotType
  private fhirService:FhirService
  private patLabel:string=""

  constructor() {
    this.cfg = Container.instance.get(Config)
    this.fhirService=Container.instance.get(FhirService)
  }

  attached(){
    let patient=this.getPatient().then(pat=>{
      if(pat) {
        let patObj = new Patient(pat)
        this.patLabel = patObj.fullName
      }
    })
  }

  state(){
    if(!this._state){
      this._state=this.cfg.getAgendaState(this.obj.getField("contained.status"))
    }
    return this._state
  }

  type(){
    if(!this._slotType){
      let freebusy = this.obj.getField('freeBusyType')
      if(freebusy=="free") {
        this._slotType = this.cfg.getAgendaType("free")
      } else{
        this._slotType= this.cfg.getAgendaType(this.obj.getField("contained.type.text"))
      }

    }
    return this._slotType
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

  getStateLabel():string{
    let ret=this.state()['label']
    if(!ret){
      ret=this.state()['name']
    }
    return ret;
  }

  getTypeLabel():string{
    let ret=this.type()['label']
    if(!ret){
      ret=this.type()['name']
    }
    return ret
  }
  getStateStyle():string{
    let ret
    if(this.state()['bg']){
      ret="background-color:"+this.state()['bg']+";"
    }
    if(this.state()['fg']){
      ret+="color:"+this.state()['fg']+";"
    }
    return ret
  }
  getTypeStyle() :string{
    let ret
    if(this.type()["bg"]){
      ret="background-color:"+this.type()['bg']+";"
    }
    if(this.type()["fg"]){
      ret+="color:"+this.type()["fg"]+";"
    }
    return ret;
  }
  getPatient():Promise<FHIR_Resource>{
    let busy= this.obj.getField('freeBusyType')
    if(busy==="busy" || busy==="busy-tentative"){
      let appnt=this.obj.fhir['contained']
      if(appnt){
        let participants=appnt['participant']
        if(Array.isArray(participants)){
          for(let i=0;i<participants.length;i++){
            if(participants[i].actor.startsWith("Patient/")){
              return this.fhirService.getByUri(participants[i].actor)
            }
          }
        }
      }
    }
    return new Promise(resolve=>{
      resolve()
    })
  }

}