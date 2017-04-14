import {FhirService} from '../../services/fhirservice';
import {Patient, PatientFactory} from "../../models/patient";
import {autoinject} from 'aurelia-framework'
import {Config} from '../../config'
import {Router} from 'aurelia-router'


@autoinject
export class SearchBox {
  public searchexpr: string = '';
  public patients: Array<Patient>
  private patientFactory
  private patientService;

  constructor(patientFactory: PatientFactory, patientService: FhirService, private cfg:Config, private router:Router) {
    this.patientFactory = patientFactory
    this.patientService = patientService
  }

  activate(){
    if(this.cfg.systemState['selectedPatient'] instanceof Patient){
     this.router.navigateToRoute("searchbox-details",{"id":this.cfg.systemState['selectedPatient'].id})
    }
  }

  doSearch = function () {
    this.patientService.filterBy(this.patientFactory, [{entity: "name", value: this.searchexpr}]).then(result => {
      if (result) {
        this.patients = result.values
      } else {
        this.patients = []
      }
    })
  }
}
