import {FhirService} from '../../services/fhirservice';
import {Patient, PatientFactory} from "../../models/patient";
import {inject} from 'aurelia-framework'
import {Config} from '../../config'
import {Router} from 'aurelia-router';
import {ObserverLocator} from 'aurelia-framework'
import * as moment from 'moment'


@inject(PatientFactory, FhirService, Config, Router, ObserverLocator)
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
    formatSubmit: 'yyyy/mm/dd',
    closeOnSelect:true,
    closeOnClear:true
  }

  constructor(patientFactory:PatientFactory, patientService:FhirService, private cfg:Config,
              private router:Router, private observerLocator:ObserverLocator) {
    this.patientFactory = patientFactory
    this.patientService = patientService
    this.officeName = cfg.general.officeName
    this.observerLocator.getObserver(this,'selectedDate').subscribe((newValue,oldValue)=>{
      console.log(newValue)
      let d=moment(newValue)
      this.router.navigate('/agenda?date='+ d.format("YYYY-MM-DD"))

    })
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