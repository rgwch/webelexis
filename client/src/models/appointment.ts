import {FHIR_Resource} from './fhir';
import {FHIRobject, FhirObjectFactory} from './fhirobj';
import {computedFrom} from 'aurelia-framework';
import * as moment from 'moment';
import 'moment/locale/de'
import {FHIR_Appointment} from "./fhir";

export class AppointmentFactory implements FhirObjectFactory{
  subtype: string = "Appointment"

  createObject(fhir: FHIR_Resource): FHIRobject {
    return new Appointment(fhir as FHIR_Appointment);
  }
  entities=["actor","date","identifier","location","part-status","patient",
    "practitioner","status"]

}
export class Appointment extends FHIRobject{


  constructor(data: FHIR_Appointment){
    super(data,'Appointment')
    moment.locale("de")

  }


  @computedFrom('fhir')
  get begin() : string{
    var tm=this.fhir["start"]
    if(!tm){
      tm=new Date()
    }
    return moment(tm).format()
  }

  @computedFrom('fhir')
  get end(): string{
    var tm= this.fhir["end"]
    if(!tm){
      tm=new Date()
    }
    return moment(tm).format()
  }

  @computedFrom('fhir')
  get duration() : number{
    var duration=this.fhir['minutesDuration']
    if(duration){
      return duration
    }else{
      return 0
    }
  }

  @computedFrom('fhir')
  get participants() {
    return this.fhir["participant"]
  }

  getDayDate() {
    let date = super.getField('start')
    if (date) {
      return moment(date).format("dd, DD.MM.YYYY")
    }
  }
}
