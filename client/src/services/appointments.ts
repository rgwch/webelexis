import {Appointment,AppointmentFactory} from '../models/appointment';
import {Schedule,ScheduleFactory} from '../models/schedule';
import {Validator} from './validator';
import {BundleResult, FhirService} from './fhirservice'
import {FHIRobject} from '../models/fhirobj'
import {FHIR_Resource} from "../models/fhir";
import {FhirBundle} from "../models/fhir";
import {autoinject} from "aurelia-framework";


@autoinject
export class AppointmentsService{
  public scheduleEntities=["actor","date","identifier","type"]
  public appointmentEntities=["actor","date","identifier","location","part-status","patient",
        "practitioner","status"]
  public slotEntities=["fb-type","identifier","schedule","slot-type","start"]

  constructor(private fhirService:FhirService,private scheduleFactory:ScheduleFactory,private appointmentFactory:AppointmentFactory){}

  filterSchedules(resource:string, forDate:string):Promise<BundleResult> {
    return this.fhirService.filterBy(this.scheduleFactory,resource,forDate)
  }

  /**
   * Filter Appointments
   * @param entity one of: actor,date,identifier,location,part-status,patient,practitioner,status
   * @param searchterm depending of entity, e.g. patient id
   * @returns Ann Array of all matching Appointments (which might be empty)
   */

  filterAppointmentsBy(entity:string,searchterm:string) : Promise<BundleResult>{
    return this.fhirService.filterBy(this.appointmentFactory,entity,searchterm)

  }

  /*
  getAppointmentById(appointmentId:string):Promise<Appointment> {
    return this.fhirService.http.get('appointments/get/' + appointmentId).then(data => {
      return new Appointment(data);
    });
  }

  saveAppointment(appointment:Appointment):Promise<number> {
    return this.http.post('appointments/saveAppointment', appointment).then(data => {
      return data.statusCode;
    });
  }
  */
}
