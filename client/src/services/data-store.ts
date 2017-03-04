import {FHIRobject} from '../models/fhirobj';
import {Appointment} from '../models/appointment';
import {HttpWrapper} from './http-wrapper';
import {FHIR_Resource} from "../models/fhir";


const CACHETIME = "_cachetime"
const DEFAULT_MAX = 1000
const DEFAULT_EXPIRY = 300000

export class DataStore {

  private objects = {}
  private num = 0
  private _maxnum:number = DEFAULT_MAX
  private _maxtime:number = DEFAULT_EXPIRY

  public push(fhir:FHIR_Resource) {
    let key = fhir.resourceType + fhir.id
    fhir[CACHETIME] = new Date().getDate()
    this.objects[key] = fhir
    this.num++
    if (this.num > this._maxnum) {
      this.purge()
    }
  }


  public fetch(id:string, subtype:string) {
    let key = subtype + id
    let test = this.objects[key]
    if (test) {
      let now = new Date().getDate()
      let diff = now - test[CACHETIME]
      if (diff > this._maxtime) {
        delete this.objects[key]
        this.num--;
        return undefined
      } else {
        delete test[CACHETIME]
        return test
      }
    } else {
      return undefined
    }
  }


  private purge() {
    let now = new Date().getDate()
    for (let key in this.objects) {
      if (now - this.objects[key][CACHETIME] > this._maxtime) {
        delete this.objects[key]
        this.num--
      }
    }
    if (this.num >= this._maxnum - (this._maxnum / 10)) {
      this.objects = {}
    }
  }

  public primeData() {
    /*
     return Promise.all([

     this.patientsService.getPatients().then(result => {
     this.patients.splice(0, this.patients.length, ...result);
     }),
     this.appointmentsService.getAppointments().then(result => {
     this.appointments.splice(0, this.appointments.length, ...result);
     })

     ]);
     */
  }
}
