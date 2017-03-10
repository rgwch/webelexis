/**********************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 **********************************************/

import {FhirService} from "../../services/fhirservice";
import {Patient} from "../../models/patient";
import {Appointment, AppointmentFactory} from "../../models/appointment";
import {autoinject} from "aurelia-framework";
import {I18N} from "aurelia-i18n";
import * as moment from "moment";
import {FHIRobject} from "../../models/fhirobj";
import {FHIR_Flag} from "../../models/fhir";
import {Encounter,EncounterFactory} from "../../models/encounter";
import {MedicationOrder, MedicationOrderFactory} from "../../models/medication-order";
import {Condition,ConditionFactory} from "../../models/condition";
import {Flag,FlagFactory} from "../../models/flag";
import {DialogResult, DialogService} from "aurelia-dialog";
import {FhirBundle} from "../../models/fhir";
import {BundleResult} from "../../services/fhirservice";

const selectedClass = "accent z-depth-5 chips"
const deselectedClass = "primary z-depth-1 chips"
const chips = ['basic', 'documents', 'labor', 'prescriptions', 'remarks', 'diags', 'cons', 'appointments']

/**
 * Display of the selected patient's data
 */
@autoinject
export class Details {
  public patient: Patient;
  public patientId: string;
  private expanded = {}
  private classes = {}
  private counts = {}
  private appointments: BundleResult
  private conditions:BundleResult
  private encounters:BundleResult
  private prescriptions:BundleResult
  private remarks: BundleResult
  private localizedDate
  public richEditorValue = "Ha"
  private isLocked: boolean = true
  private test = "t"

  details() {
    let l = JSON.stringify(this.patient)
    console.log(l)
    return l
  }

  jsonize(js){
    return JSON.stringify(js)
  }
  constructor(private fhirService: FhirService, private dialogs: DialogService,
              private tr: I18N, private encounterFactory:EncounterFactory,
              private flagFactory:FlagFactory, private appointmentFactory:AppointmentFactory,
              private conditionFactory:ConditionFactory, private medicationOrderFactory:MedicationOrderFactory) {
    chips.forEach(chip => {
      this.expanded[chip] = false
      this.classes[chip] = deselectedClass
      this.counts[chip] = 0
    })
  }

  loadMore(data,factory){
    let next=data.links.find(link=>{return link.relation=="next"})
    if(next){
      this.fhirService.getBatch(next.url,factory).then(batch=>{
        if(batch.status==="ok"){
          let extended=data.values.concat(batch.values)
          data.links=batch.links
          data.values=extended
        }
      })
    }
  }
  setPatient(pat: Patient) {
    if (pat) {
      this.patient = pat
      this.patientId = pat.id
      var raw = this.patient.fhir["birthDate"]
      this.localizedDate = raw ? moment(raw).format(this.tr.tr('adapters.date_format')) : "?"
      let searchTerm=[{entity:"patient", value:this.patientId}]

      this.fhirService.filterBy(this.encounterFactory, searchTerm).then(result => {
        this.encounters = result
        this.counts["cons"] = result.count
      })


      this.fhirService.filterBy(this.flagFactory, searchTerm).then(result => {
        this.remarks = result
        this.counts["remarks"] = result.count
      })

      this.fhirService.filterBy(this.appointmentFactory, searchTerm).then(result => {
        this.appointments = result
        this.counts["appointments"] = result.count
      })


      this.fhirService.filterBy(this.conditionFactory, searchTerm).then(result => {
        this.conditions = result
        this.counts["diags"] = result.values
      })
      this.fhirService.filterBy(this.medicationOrderFactory, searchTerm).then(result => {
        this.prescriptions = result
        this.counts['prescriptions'] = result.values
      })

    } else {
      this.encounters = undefined
      chips.forEach(chip => this.counts[chip] = 0)

    }
  }

  activate(params) {
    this.patientId = params.id;
    return this.fhirService.getById("Patient", this.patientId).then(result => {
      this.setPatient(new Patient(result));
    })

  }

  deactivate(params) {
    let standard = moment(this.localizedDate).format()
    this.patient.fhir["birthDate"] = standard
  }

  lockToggle() {
    this.isLocked = !this.isLocked
  }

  toggle(field: string) {
    for (let entry in this.expanded) {
      this.expanded[entry] = false;
      this.classes[entry] = deselectedClass
    }
    this.expanded[field] = true
    this.classes[field] = selectedClass
  }


  newFlag() {
    this.dialogs.open({"viewModel": "dialogs/create-flag"}).then(response => {
      if (!(response as DialogResult).wasCancelled) {
        let cat = response.output.cat
        let text = response.output.text
        let heading = response.output.heading
        let flag: FHIR_Flag = <FHIR_Flag>{
          "resourceType": "Flag",
          "id"          : "a",
          "status"      : "active",
          "category"    : {
            "coding": [{
              "system" : "xid.ch/flags/categories",
              "code"   : cat,
              "display": cat
            }],
            "text"  : cat
          },
          "code"        : {
            "coding": [
              {
                "system" : "xid.ch/flags",
                "code"   : "user",
                "display": heading

              }
            ],
            "text"  : text
          }
        }
        /*
        this.fhirService.create("Flag", flag).then(result => {
          this.remarks.push(new Flag(result))
        })
        */
      }
    })
  }

  newPatient() {
    this.dialogs.open({"viewModel": "dialogs/create-person"}).then(response => {
      if (!response.wasCancelled) {
        let raw = response.output
        console.log(JSON.stringify(raw))
        this.fhirService.create("Patient", raw).then(result => {
          this.setPatient(new Patient(result))
        })

      }
    })
  }

  getPreferredCommunication() {
    let comm = this.patient.getContactMethods().getPreferred()
    let system = comm.system ? this.tr.tr('personalDetails.' + comm.system) : ""
    let use = comm.use ? this.tr.tr('personalDetails.' + comm.use) : ""
    let ret = `${system} ${use}: ${comm.value}`
    if (ret.length < 5) {
      ret = this.tr.tr('none')
    }
    return ret
  }
}
