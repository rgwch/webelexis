import { computedFrom } from 'aurelia-binding';
import { autoinject, bindable, valueConverter, observable } from "aurelia-framework";
import { TerminModel, Statics, TerminType } from "models/termine-model";
import * as moment from 'moment'

@autoinject
export class NewAppointment{
  @bindable termin:TerminModel
  time:moment.Moment
  slider:moment.Moment


  termintypen=[]
  terminstaten=[]
  terminTyp
  terminStatus
  duration:number

  attached(){
    this.time=this.termin.getStartTime()
    this.duration=this.termin.obj.Dauer
    this.termintypen=Statics.terminTypes
    this.terminstaten=Statics.terminStates
    this.terminTyp=this.termintypen[2]
    this.terminStatus=this.terminstaten[1]    
  }

}


