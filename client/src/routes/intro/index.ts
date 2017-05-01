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
import {HttpWrapper} from "../../services/http-wrapper";
import {DocumentReference, DocumentReferenceFactory} from "../../models/document-reference";
import {FHIR_DocumentReference} from "../../models/fhir";


@autoinject
export class Intro {
  selectedDate: Date
  selectedResource
  public searchexpr: string = '';
  public docsearch: string = ''
  public patients: Array<Patient>
  public documents: Array<DocumentReference>
  private officeName = "Webelexis"
  private actors = []
  private selectedActor = {}
  private dateSubscriber
  private resourceSubscriber


  constructor(private patientFactory: PatientFactory, private fhirService: FhirService, private cfg: Config,
              private router: Router, private ea: EventAggregator, private http: HttpWrapper, private documentFactory:DocumentReferenceFactory) {
    this.officeName = cfg.general.officeName || "Webelexis"


  }

  goAgenda() {
    let d = moment(this.selectedDate)
    if (!this.selectedResource) {
      this.selectedResource = this.cfg.general.actors[0]
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
    this.fhirService.filterBy(this.patientFactory, [{entity: "name", value: this.searchexpr}]).then(result => {
      if (result) {
        this.patients = result.values
      } else {
        this.patients = []
      }
    })
  }

  documentSearch = function () {
    this.fhirService.filterBy(this.documentFactory, [{entity: "query", value: this.docsearch}]).then(result =>{
      if(result){
        this.documents=result.values
      }else{
        this.documents=[]
      }
    })
  }

  fetch=function(id){
    this.http.get(`DocumentReference/${id}`).then(result=>{
      if(typeof result === 'string'){
        result=JSON.parse(result)
      }
      if(result.content){
        let content=result.content[0]
        if(content){
          let attachment=content.attachment
          if(attachment){
            let data=attachment.data
            if(data){
              window.open("data:application/pdf;base64,"+data,"_blank")
            }
          }
        }
      }
    })
  }
  getPath = function (docRef: DocumentReference) {
    let url=this.http.formatUrl("DocumentReference/"+docRef.getField("id"))
    return url
  }
}
