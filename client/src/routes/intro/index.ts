import {FhirService} from '../../services/fhirservice';
import {Patient, PatientFactory} from "../../models/patient";
import {inject} from 'aurelia-framework'
import {Config} from '../../config'

@inject(PatientFactory, FhirService, Config)
export class Intro{
  selectedDate:Date
  public searchexpr: string = '';
  public patients: Array<Patient>
  private patientFactory
  private patientService;
  private officeName="Webelexis"

  constructor(patientFactory: PatientFactory, patientService: FhirService, private cfg:Config) {
    this.patientFactory=patientFactory
    this.patientService=patientService
    this.officeName=cfg.general.officeName
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