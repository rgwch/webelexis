import { I18N } from 'aurelia-i18n';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, bindable, observable } from "aurelia-framework";
import { TerminModel, Statics} from "models/termine-model";
import {DateTime} from '../../services/datetime'
import { Patient } from 'models/patient';
import {DialogService} from 'aurelia-dialog'
import { SelectPatient } from './../../dialogs/select-pat';
import { WebelexisEvents } from './../../webelexisevents';
import { KontaktType } from './../../models/kontakt';


@autoinject
export class NewAppointment{
  @bindable termin:TerminModel
  time:string
  @observable slider:number
  
  termintypen=[]
  terminstaten=[]
  terminTyp
  terminStatus
  kontakt:KontaktType
  patlabel:string
 
  constructor(private dt:DateTime,private we:WebelexisEvents, 
    private ds:DialogService, private i18:I18N){}

  sliderChanged(minutes:number){
    this.time=this.dt.minutesToTimeString(minutes)
  }

  attached(){
    //this.duration=this.termin.obj.Dauer
    this.termintypen=Statics.terminTypes
    this.terminstaten=Statics.terminStates
    this.terminTyp=this.termintypen[2]
    this.terminStatus=this.terminstaten[1]   
    this.slider=this.termin.getEndMinutes()
    this.kontakt=this.we.getSelectedItem('patient')
    this.patlabel=this.kontakt ? Patient.getLabel(this.kontakt) : this.i18.tr('info.nopatselected')
  }

  selectPatient(){
    this.ds.open({ viewModel: SelectPatient, model: this.kontakt, lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log(this.kontakt)
      } else {
        
      }
      console.log(response.output);
    });
  }

  newTermin(){
    
  }
}


