import {computedFrom} from 'aurelia-framework';
import {Container} from 'aurelia-framework'
import {I18N} from 'aurelia-i18n'
import * as moment from 'moment'
import {FHIR_Patient,FHIR_Resource,FHIR_Address} from "./fhir";
import {Validator} from "../services/validator";
import {AddressList} from "./address-list"
import {CommunicationList} from "./communications-list";
import {FHIRobject, FhirObjectFactory} from './fhirobj'

export class PatientFactory implements FhirObjectFactory {
  entities:Array<string> = ["name"]
  subtype:string = "Patient"

  createObject(fhir:FHIR_Resource):FHIRobject {
    return new Patient(fhir);
  }

}
export class Patient extends FHIRobject {

  constructor(data:FHIR_Resource) {
    super(data, "Patient")
  }


  @computedFrom('fhir')
  get firstName() {
    return (this.fhir as FHIR_Patient).name[0].given
  }


  @computedFrom('fhir')
  get lastName() {
    return (this.fhir as FHIR_Patient).name[0].family
  }

  set lastName(name) {
    (this.fhir as FHIR_Patient).name[0].family = name
  }

  @computedFrom('fhir')
  get birthDate() {
    let i18 = Container.instance.get(I18N)
    var raw = (this.fhir as FHIR_Patient).birthDate
    return raw ? moment(raw).format(i18.tr('adapters.date_format')) : "?"

  }

  @computedFrom('fhir')
  get gender():string {
    let g:string = (this.fhir as FHIR_Patient).gender
    if (g) {
      return g.substring(0, 1)
    } else {
      return "u"
    }
  }

  @computedFrom('firstName', 'lastName')
  get fullName() {
    let ret = ""
    if (this.firstName) {
      ret += this.firstName
    }
    if (this.lastName) {
      ret += " " + this.lastName
    }
    if (this.gender) {
      ret += " (" + this.gender.substr(0, 1) + ")"
    }
    if (this.birthDate) {
      ret += " " + this.birthDate
    }
    return ret
  }

  getAddresses() {
    return new AddressList(Validator.getArray(this.fhir, 'address'))
  }

  getContactMethods() {
    return new CommunicationList(Validator.getArray(this.fhir, 'telecom'))
  }

  get salutation() {
    return ""
    // should return something like "Sehr geehrter Herr Müller" in german, and
    // something like "cher Monsieur" in french.
  }
}
