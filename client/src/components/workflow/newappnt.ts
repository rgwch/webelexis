import { computedFrom } from 'aurelia-binding';
import { autoinject, bindable, valueConverter, observable } from "aurelia-framework";
import { TerminModel, Statics, TerminType } from "models/termine-model";
import * as moment from 'moment'
import {DateTime} from '../../services/datetime'

@autoinject
export class NewAppointment{
  @bindable termin:TerminModel
  time:string
  @observable slider:number
  
  termintypen=[]
  terminstaten=[]
  terminTyp
  terminStatus
 
  constructor(private dt:DateTime){}

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
  }

}


