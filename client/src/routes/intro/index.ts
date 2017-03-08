import {FhirService} from '../../services/fhirservice';
import {Patient, PatientFactory} from "../../models/patient";
import {inject} from 'aurelia-framework'
import {Config} from '../../config'
import {Router} from 'aurelia-router';


@inject(PatientFactory, FhirService, Config, Router)
export class Intro {
  selectedDate:Date
  public searchexpr:string = '';
  public patients:Array<Patient>
  private patientFactory
  private patientService;
  private officeName = "Webelexis"

  private agendaD = {
    monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    today: 'Heute',
    clear: 'Löschen',
    close: 'Schließen',
    firstDay: 1,
    format: 'dddd, dd. mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
  }

  constructor(patientFactory:PatientFactory, patientService:FhirService, private cfg:Config, private router:Router) {
    this.patientFactory = patientFactory
    this.patientService = patientService
    this.officeName = cfg.general.officeName
  }

  goToAgenda(){
    this.router.navigate('agenda')
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