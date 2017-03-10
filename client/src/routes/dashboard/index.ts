import {FhirService} from '../../services/fhirservice';
import {Patient, PatientFactory} from "../../models/patient";
import {inject} from 'aurelia-framework'

@inject(PatientFactory, FhirService)
export class SearchBox {
  public searchexpr: string = '';
  public patients: Array<Patient>
  private patientFactory
  private patientService;

  constructor(patientFactory: PatientFactory, patientService: FhirService) {
    this.patientFactory=patientFactory
    this.patientService=patientService
  }

  doSearch = function () {
    this.patientService.filterBy(this.patientFactory, [{entity:"name", value:this.searchexpr}]).then(result => {
      if (result) {
        this.patients = result.values
      } else {
        this.patients = []
      }
    })
  }
}