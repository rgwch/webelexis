/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FhirService} from "../../services/fhirservice";
import {Patient, PatientFactory} from "../../models/patient";
import {autoinject} from "aurelia-framework";
import {Config} from "../../config";
import {Router} from "aurelia-router";
import {EventAggregator} from "aurelia-event-aggregator";
import * as moment from "moment";


@autoinject
export class Intro {
  selectedDate: Date
  selectedResource
  public searchexpr: string = '';
  public patients: Array<Patient>
  private officeName = "Webelexis"
  private actors = []
  private selectedActor = {}
  private dateSubscriber
  private resourceSubscriber


  constructor(private patientFactory: PatientFactory, private patientService: FhirService, private cfg: Config,
              private router: Router, private ea: EventAggregator) {
    this.officeName = cfg.general.officeName


  }

  goAgenda() {
    let d = moment(this.selectedDate)
    if(!this.selectedResource){
      this.selectedResource=this.cfg.general.actors[0]
    }
    this.router.navigate(`/agenda?date=${d.format("YYYY-MM-DD")}&actor=${this.selectedResource['shortLabel']}`)
  }

  attached() {

    this.dateSubscriber = this.ea.subscribe("datepicker", dateEvent => {
      console.log(dateEvent.newDate)
      let d = moment(dateEvent.newDate)
      //window.location.assign(`/#/agenda?date=${d.format("YYYY-MM-DD")}&actor=${this.selectedActor['shortLabel']}`)
      //this.router.navigate(`/agenda?date=${d.format("YYYY-MM-DD")}&actor=${this.selectedActor['shortLabel']}`)
      this.selectedDate = d.toDate()
    })
    this.resourceSubscriber = this.ea.subscribe("pickresource", resource => {
      this.selectedResource = resource
    })

  }


  detached() {
    console.log("detached")
    this.dateSubscriber.dispose()
    this.resourceSubscriber.dispose()
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
