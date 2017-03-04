import {FHIRobject} from "../models/fhirobj";
import {Medication} from "../models/medication"
import {bindable,inject} from "aurelia-framework";
import {FhirService} from "../services/fhirservice";
import {MedicationOrder} from "../models/medication-order";
import {CodeableConcept} from "../models/codeable-concept";
import {FHIR_MedicationOrder} from "../models/fhir";
import {FHIR_Medication} from "../models/fhir";

@inject(FhirService)
export class MedicationOrderView{
  @bindable obj:MedicationOrder
  medication:Medication

  constructor(private fhirService:FhirService){}

  bind(context, override){
    if(this.obj.fhir.resourceType !== "MedicationOrder"){
      throw "bad object assignment"
    }
    let fhir:FHIR_MedicationOrder=this.obj.fhir as FHIR_MedicationOrder
    let med=fhir.medicationCodeableConcept
    if(med){
      let fhm:FHIR_Medication={
        "resourceType":"Medication",
        "id":"generated",
        "code":[med]
      }
      this.medication=new Medication(fhm)
    }else{
      this.fhirService.getByUri(fhir.medicationReference.reference).then(result =>{
        this.medication=new Medication(result)
      })
    }

  }
}
