/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */


import {autoinject, bindable, computedFrom} from "aurelia-framework";
import {Slot} from "../models/slot";
import {Config} from "../config";
import {FhirService} from "../services/fhirservice";
import {FHIR_Resource} from "../models/fhir";
import {Patient} from "../models/patient";
import {EventAggregator} from "aurelia-event-aggregator";
import {AgendaRoute} from "../routes/agenda/index";

/**
 * Display a FHIR_Slot
 */
@autoinject
export class SlotView {
  @bindable obj: Slot
  @bindable parent: AgendaRoute
  private large = false
  private _state
  private _slotType
  private patient: Patient
  private patLabel: string = ""
  private possibleStates: Array<any> = []

  constructor(private cfg: Config, private ea: EventAggregator, private fhirService: FhirService) {
    this.possibleStates = this.cfg.agenda.states
  }

  get unique() {
    return this.obj.getUnique('menu')
  }

  normalMenu() {
    return (this.obj.getField('freeBusyType') === 'busy')
  }

  attached() {
    this.obj.getPatient().then(pat => {
      if (pat) {
        this.patient = new Patient(pat)
        this.patLabel = this.patient.fullName
      }
    })
  }

  state() {
    if (!this._state) {
      this._state = this.cfg.getAgendaState(this.obj.getField("contained.status"))
    }
    return this._state
  }

  type() {
    if (!this._slotType) {
      let freebusy = this.obj.getField('freeBusyType')
      if (freebusy == "free") {
        this._slotType = this.cfg.getAgendaType("free")
      } else {
        this._slotType = this.cfg.getAgendaType(this.obj.getField("contained.type.text"))
      }

    }
    return this._slotType
  }

  setType(type = null) {
    if (!type) {
      type = this._slotType
    }
    if (type == this.cfg.getAgendaType('free')) {
      this.obj.setField('freeBusyType', "free")
    } else {
      this.obj.setField('contained.type.text', type.name)
    }
  }

  setState(state) {
    this._state = state
    this.obj.setField('contained.status', state.name)
  }

  advState() {
    let oldState = this._state
    let idx = this.possibleStates.findIndex(elem => {
      return elem['name'] == oldState.name
    })
    idx += 1;
    if (idx >= this.possibleStates.length) {
      idx = 0
    }
    this.setState(this.possibleStates[idx])
    this.storeAndReload()
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

  hasStateLabel(): boolean {
    return this.stateLabel.length > 0
  }

  @computedFrom('_state')
  get stateLabel(): string {
    let ret = this.state()['label']
    if (!ret) {
      ret = this.state()['name']
    }
    return ret;
  }

  getTypeLabel(): string {
    let ret = this.type()['label']
    if (!ret) {
      ret = this.type()['name']
    }
    return ret
  }

  get reason(): string {
    let ret = this.obj.getField("contained.description")
    if (!ret) {
      ret = this.obj.getField("contained.reason.text")
    }
    return ret.length > 0 ? ret : undefined
  }

  set reason(value: string) {
    this.obj.setField("contained.description", value)
  }

  @computedFrom('_state')
  get stateStyle(): string {
    let ret
    if (this.state()['bg']) {
      ret = "background-color:" + this.state()['bg'] + ";"
    }
    if (this.state()['fg']) {
      ret += "color:" + this.state()['fg'] + ";"
    }
    return ret
  }

  @computedFrom('large')
  get popout() {
    let ret
    if (this.large) {
      ret = "margin:5px;padding:5px;border:1px solid blue;"
    } else {
      ret = "margin:1px;"
    }
    return ret
  }

  getTypeStyle(): string {
    let ret
    if (this.type()["bg"]) {
      ret = "background-color:" + this.type()['bg'] + ";"
    }
    if (this.type()["fg"]) {
      ret += "color:" + this.type()["fg"] + ";"
    }
    ret += "padding-top:2px"
    return ret;
  }



  details() {
    alert(this.getLabel())
  }

  largeToggle() {
    this.large = !this.large
  }

  storeAndReload(){
    this.save().then(result=>{
      this.parent.reload()
    })
  }
  save() {
    this.setType()
    this.obj.setField('contained.status', this._state.name)
    return this.fhirService.update(this.obj.fhir)
  }

  select(){
    this.cfg.systemState["selectedPatient"]=this.patient
  }

}
