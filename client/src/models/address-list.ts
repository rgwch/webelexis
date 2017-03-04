import {FHIR_Address} from './fhir';
import {Validator} from '../services/validator';
export class AddressList {

  constructor(private fhir:Array<FHIR_Address>) {}

  homeAddress() {
    this.fhir.forEach(address => {
      if (Validator.getString(address, 'use') === 'home') {
        return address
      }
    })
    return {}
  }

  workAddress() {
    this.fhir.forEach(address => {
      if (Validator.getString(address, 'use') === 'work') {
        return address
      }
    })
    return {}
  }

  firstAddress() {
    if (this.fhir == null || this.fhir.length == 0) {
      return {}
    } else {
      return this.fhir[0]
    }
  }

  allAddresses():Array<any> {
    if (this.fhir == null || this.fhir.length == 0) {
      return []
    } else {
      return this.fhir
    }
  }

}