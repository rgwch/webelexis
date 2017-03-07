/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
**********************************/
import {Patient} from '../models/patient';
import {bindable,inject} from 'aurelia-framework';
import {FHIR_Resource} from '../models/fhir';
import {FHIRobject} from "../models/fhirobj";
import {Appointment} from "../models/appointment";
import {I18N} from 'aurelia-i18n'
import {Config} from '../config'
import {FhirService} from '../services/fhirservice'

@inject(I18N, FhirService,Config)
export class AppointmentView {
  @bindable obj:Appointment
  @bindable large:boolean = false

  statusStyle = "background-color:#111111;"
  typeStyle = "background-color:red;"
  //possibleTypes = Config.agenda.types
  //possibleStates = Config.agenda.states

  constructor(private i18:I18N, private fhirs:FhirService, private config:Config) {
  }

  bind(context,overide){
    if(this.obj.fhir.resourceType !== "Appointment"){
      throw "bad object assignment"
    }
  }

  get selectedStatus(){
    let statusname=this.obj.getField("status")
    let stat = this.config.getAgendaState(statusname)
    this.statusStyle = `background-color:${stat.bg}; color:${stat.fg}`
    return stat
  }

  set selectedStatus(status){
    this.obj.setField("status",status.name)
    this.statusStyle = `background-color:${status.bg}; color:${status.fg}`
  }

  get selectedType():any {
    let typename=this.obj.getField('type.coding[0].display')
    let type=this.config.getAgendaType(typename)
    this.typeStyle = `background-color:${type.bg}; color:${type.fg}`

    return type
  }

  set selectedType(type:any){
    this.typeStyle = `background-color:${type.bg}; color:${type.fg}`
    this.obj.setField('type.coding[0].display',type.label)
  }

  advanceStatus(){
    let i=this.config.agenda.states.indexOf(this.selectedStatus)+1
    if(i>=this.config.agenda.states.length){
      i=0
    }
    this.selectedStatus=this.config.agenda.states[i]

  }
  largeToggle() {
    this.large=!this.large
  }

  save(){
    this.fhirs.update(this.obj.fhir)
  }
}
