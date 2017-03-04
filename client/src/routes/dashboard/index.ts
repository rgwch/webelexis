import {FhirService} from '../../services/fhirservice';
import {Patient, PatientFactory} from "../../models/patient";
import {inject} from 'aurelia-framework'

@inject(PatientFactory, FhirService)
export class SearchBox {
  public searchexpr: string = '';
  public patients: Array<Patient>

  constructor(private patientFactory: PatientFactory, private patientService: FhirService) {
  }

  doSearch = function () {
    this.patientService.filterBy(this.patientFactory, "name", this.searchexpr).then(result => {
      if (result) {
        this.patients = result.values
      } else {
        this.patients = []
      }
    })
  }
}