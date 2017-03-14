/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FhirService} from '../../services/fhirservice';
import {Patient, PatientFactory} from "../../models/patient";
import {autoinject} from 'aurelia-framework'
import {Config} from '../../config'
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator'
import * as moment from 'moment'


@autoinject
export class Intro {
  selectedDate: Date
  public searchexpr: string = '';
  public patients: Array<Patient>
  private patientFactory
  private patientService;
  private officeName = "Webelexis"
  private actors = []
  private selectedActor = {}
  private subscriber


  constructor(patientFactory: PatientFactory, patientService: FhirService, private cfg: Config,
              private router: Router, private ea: EventAggregator) {
    this.patientFactory = patientFactory
    this.patientService = patientService
    this.officeName = cfg.general.officeName
    this.actors = cfg.general.actors
    this.subscriber = this.ea.subscribe("datepicker", dateEvent => {
      console.log(dateEvent.newDate)
      let d = moment(dateEvent.newDate)
      //window.location.assign(`/#/agenda?date=${d.format("YYYY-MM-DD")}&actor=${this.selectedActor['shortLabel']}`)
      this.router.navigate(`/agenda?date=${d.format("YYYY-MM-DD")}&actor=${this.selectedActor['shortLabel']}`)
    })

  }

  attached() {

  }

  /*
   detached(){
   console.log("detached")
   // this.subscriber.dispose()
   }
   */
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
