/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */


import {bindable, Container, computedFrom, autoinject} from "aurelia-framework";
import {Slot} from "../models/slot";
import {FHIRobject} from "../models/fhirobj";
import {Config} from '../config'
import {FhirService} from '../services/fhirservice'
import {FHIR_Resource} from "../models/fhir";
import {Patient} from "../models/patient";
import * as moment from 'moment'
import {EventAggregator} from 'aurelia-event-aggregator'

@autoinject()
export class SlotView {
  @bindable obj:FHIRobject
  private large = false
  //private cfg
  private _state
  private _slotType
  //private fhirService:FhirService
  private patLabel:string = ""
  private possibleStates:Array<string> = []
  //private ea:EventAggregator

  constructor(private cfg:Config, private ea:EventAggregator, private fhirService:FhirService) {
    // this.cfg = Container.instance.get(Config)
    // this.ea = Container.instance.get(EventAggregator)
    // this.fhirService = Container.instance.get(FhirService)
    this.possibleStates = this.cfg.agenda.states
  }

  attached() {
    let patient = this.getPatient().then(pat => {
      if (pat) {
        let patObj = new Patient(pat)
        this.patLabel = patObj.fullName
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

  hasStateLabel():boolean {
    return this.stateLabel.length > 0
  }

  @computedFrom('_state')
  get stateLabel():string {
    let ret = this.state()['label']
    if (!ret) {
      ret = this.state()['name']
    }
    return ret;
  }

  getTypeLabel():string {
    let ret = this.type()['label']
    if (!ret) {
      ret = this.type()['name']
    }
    return ret
  }

  get reason():string {
    let ret = this.obj.getField("contained.reason.text")
    return ret.length > 0 ? ret : undefined
  }

  set reason(value:string) {
    this.obj.setField("contained.reason.text", value)
  }

  @computedFrom('_state')
  get stateStyle():string {
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

  getTypeStyle():string {
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

  getPatient():Promise<FHIR_Resource> {
    let busy = this.obj.getField('freeBusyType')
    if (busy === "busy" || busy === "busy-tentative") {
      let appnt = this.obj.fhir['contained']
      if (appnt) {
        let participants = appnt['participant']
        if (Array.isArray(participants)) {
          for (let i = 0; i < participants.length; i++) {
            if (participants[i].actor.startsWith("Patient/")) {
              return this.fhirService.getByUri(participants[i].actor)
            }
          }
        }
      }
    }
    return new Promise(resolve => {
      resolve()
    })
  }

  details() {
    alert(this.getLabel())
  }

  largeToggle() {
    this.large = !this.large
  }

  save() {
    return this.fhirService.update(this.obj.fhir)
  }

  shorten() {
    let end = moment(this.obj.getField('end'))
    let start = moment(this.obj.getField('start'))
    let diff = (end.unix() - start.unix()) / 2
    let newEnd = start.add(diff, 'seconds')
    this.obj.setField('end', newEnd.format())
    this.obj.setField('contained.end',newEnd.format())
    this.save().then(result=>{
      this.ea.publish('agenda_reload')
    }).catch(err=>{
      alert("error "+err)
    })
  }
}