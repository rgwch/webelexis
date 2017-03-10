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
    return this.fhirService.filterBy(this.scheduleFactory,[{entity:resource,value:forDate}])
  }

  /**
   * Filter Appointments
   * @param entity one of: actor,date,identifier,location,part-status,patient,practitioner,status
   * @param searchterm depending of entity, e.g. patient id
   * @returns Ann Array of all matching Appointments (which might be empty)
   */

  filterAppointmentsBy(entity:string,searchterm:string) : Promise<BundleResult>{
    return this.fhirService.filterBy(this.appointmentFactory,[{entity:entity,value:searchterm}])

  }

}
