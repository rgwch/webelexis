/**
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {FHIR_Resource} from "./fhir";
import {FHIRobject, FhirObjectFactory} from "../models/fhirobj";
import {FHIR_Slot} from "../models/fhir";
import {Patient} from "../models/patient";

export class SlotFactory implements FhirObjectFactory {
  entities: Array<string> = ["fb-type", "schedule", "slot-type", "start"]
  subtype: string = "Slot"

  createObject(fhir: FHIR_Slot): FHIRobject {
    return new Slot(fhir);
  }

}

export class Slot extends FHIRobject {

  constructor(fhir: FHIR_Slot) {
    super(fhir, "Slot")
  }

  async getPatientLabel(){
    let pat=await this.getPatient()
    if(pat){
      let patObj = new Patient(pat)
      return patObj.fullName
    }else{
      return ""
    }
  }
  getPatient(): Promise<FHIR_Resource> {
    let busy = this.getField('freeBusyType')
    if (busy === "busy" || busy === "busy-tentative") {
      let appnt = this.fhir['contained']
      if (appnt) {
        let participants = appnt['participant']
        if (Array.isArray(participants)) {
          for (let i = 0; i < participants.length; i++) {
            if (participants[i].actor.startsWith("Patient/")) {
              return this.fhirService.getByUri(participants[i].actor)
            }
          }
        }
      }
    }
    return new Promise(resolve => {
      resolve()
    })

  }
}
