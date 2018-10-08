import { autoinject, bindable } from "aurelia-framework";
import { TerminModel, Statics, TerminType } from "models/termine-model";
import * as moment from 'moment'

@autoinject
export class NewAppointment{
  @bindable termin:TerminModel
  slider:moment.Moment

  termintypen=[]
  terminstaten=[]
  terminTyp
  terminStatus

  
  attached(){
    this.termintypen=Statics.terminTypes
    this.terminstaten=Statics.terminStates
    this.terminTyp=this.termintypen[2]
    this.terminStatus=this.terminstaten[1]
    this.slider=this.termin.getStartTime()
    
  }
}



