import {FHIRobject, FhirObjectFactory} from "./fhirobj";
import {FHIR_Resource} from "./fhir";
import {computedFrom} from "aurelia-framework";
import {FHIR_CodeableConcept} from "./fhir";
import * as XID from './xid'

export class EncounterFactory implements FhirObjectFactory {
  createObject(fhir: FHIR_Resource): FHIRobject {
    return new Encounter(fhir);
  }

  entities: Array<string> = ["appointment", "condition", "date", "episodeofcare", "identifier", "incomingreferral",
    "indication", "length", "location", "location-period", "part-of", "participant", "participant-type",
    "patient", "practitioner", "procedure", "reason", "special-arrangement", "status", "type"]

  subtype = "Encounter"
}

export class Encounter extends FHIRobject {


  constructor(fhir: FHIR_Resource) {
    super(fhir, "Encounter")
  }

  /**
   * Status of the encounter. One of planned,arrived,in-progress,onleave,finished,cancelled
   */
  @computedFrom('fhir')
  get status(): string {
    return this.fhir["status"]
  }

  @computedFrom('fhir')
  get type(): Array<FHIR_CodeableConcept> {
    return this.fhir["type"]
  }

  @computedFrom('fhir')
  get priority(): FHIR_CodeableConcept {
    return this.fhir["priority"]
  }

  @computedFrom('fhir')
  get case(): Array<String> {
    return this.fhir["episodeOfCare"]
  }

  @computedFrom('fhir')
  get text(): string {
    return this.fhir["text.div"] // from DomainResource
  }

  getConsLabel(): string {
    let ret = this.getDateField('period.start')
    if (this.fhir.identifier) {
      let result = this.fhir.identifier.find(identifier => {
        return (identifier.system == XID.domains.elexis_conslabel)
      })
      if (result) {
        return ret + " - " + result.value
      }
    }
    return ret
  }
}
