import { computedFrom } from 'aurelia-binding';
import { autoinject, bindable, valueConverter, observable } from "aurelia-framework";
import { TerminModel, Statics, TerminType } from "models/termine-model";
import * as moment from 'moment'

@autoinject
export class NewAppointment{
  @bindable termin:TerminModel
  time:moment.Moment
  @observable slider:number
  from: moment.Moment
  
  termintypen=[]
  terminstaten=[]
  terminTyp
  terminStatus
  sliderStart:number
  sliderEnd:number
  // duration:number // length of free slot in minutes

  sliderChanged(minutes:number){
    // const minutes=this.duration/100*percent
    //this.time=this.from.clone()
    this.time.minute(minutes)
  }

  attached(){
    this.sliderStart=this.termin.getBeginMinutes()
    this.sliderEnd=this.termin.getEndMinutes()
    this.from=this.termin.getStartTime()
    //this.duration=this.termin.obj.Dauer
    this.termintypen=Statics.terminTypes
    this.terminstaten=Statics.terminStates
    this.terminTyp=this.termintypen[2]
    this.terminStatus=this.terminstaten[1]   
    this.time=this.from.clone() 
    this.slider=this.sliderStart
  }

}


