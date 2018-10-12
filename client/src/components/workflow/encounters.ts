import { bindable } from 'aurelia-framework';

/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 List of elexis encounters of the currently selected patient
*/

import { State } from '../../state';
import { DataSource, DataService } from '../../services/datasource';
import { pluck } from 'rxjs/operators'
import { connectTo } from 'aurelia-store'
import { autoinject, observable } from 'aurelia-framework';
import { CaseManager } from './../../models/case';
import { EncounterType } from 'models/encounter';
import * as moment from 'moment'
import defaults from '../../user/global'
import { UserType } from './../../models/user';
import { WebelexisEvents } from './../../webelexisevents';

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(<any>pluck('patient')),
    //actCase: store=>store.state.pipe(pluck('case')),
    actKons: store => store.state.pipe(<any>pluck('konsultation'))
  }
})
@autoinject
export class Encounters {
  encounters = { data: [] }
  cases = []
  lastEntry: number = 0
  private konsultationService: DataService
  private actPatient
  @observable actCase
  @observable searchexpr="ha"

  canCreate = true

  actPatientChanged(newValue, oldValue) {
    this.actCase=null
    this.searchexpr=""
    this.refresh()
  }

  actCaseChanged(newValue,oldValue){
    this.refresh()
  }

  searchexprChanged(newval,oldval){
    this.refresh()
  }

  constructor(private ds: DataSource, private caseManager: CaseManager, private we: WebelexisEvents) {
    this.konsultationService = this.ds.getService('konsultation')
  }

  attached() {
    this.konsultationService.on('created', this.consActions)
    this.konsultationService.on('updated', this.consActions)

  }

  detached() {
    this.konsultationService.off('created', this.consActions)
    this.konsultationService.off('updated', this.consActions)

  }

  /**
   * On create or update events just reload, if it's our business.
   */
  consActions = (obj: EncounterType) => {
    const concern = this.cases.find(fall => { return fall.id === obj.fallid })
    if (concern && (this.actCase == null || concern.id == this.actCase.id)) {
      this.fetchData(this.actPatient)
    }
  }

  newEncounter() {
    if (this.actCase != null) {
      const fall = this.actCase
      const user: UserType = this.we.getSelectedItem('usr')
      let mandator = user.id
      if (user.elexiskontakt) {
        if (user.elexiskontakt.istmandant == "1") {
          mandator = user.elexiskontakt.id
        }
      }
      const kons: EncounterType = {
        datum: moment().format("YYYYMMDD"),
        Zeit: moment().format("HH:mm:ss"),
        fallid: this.actCase.id,
        mandantid: defaults.mandator || mandator,
        eintrag: {
          remark: user.label,
          html: "<p></p>",
          timestamp: moment().format("DD.MM.YYYY, HH:mm:ss")
        }
      }
      this.konsultationService.create(kons).then(result=>{
        this.lastEntry=0
      }).catch(err=>{
        if(err.code==400){
          alert("The database could not handle the request. Please make sure that the server is running and that the database has the necessary modifications for webelexis.")
        }
        else{
          alert("Could not save")
        }
      })
    }
  }

  refresh(){
    this.encounters.data=[]
    this.lastEntry=0
    this.fetchData(this.actPatient)
  }
 

  /**
   * Fetch new data. The method is either called from actPatientChanged, then data of the new patient
   * must be loaded. Or it's called as CustomEvent from the EndlessScroll-widtget, then more data of the current
   * patient must be fetched.
   * @param ev
   */
  fetchData(ev) {
    let id;
    if (ev) {
      id = ev.id
    }
    if (ev instanceof CustomEvent) {
      if (this.actPatient) {
        id = this.actPatient.id
      }
    }
    if (id) {
      const expr:any={
        patientId: id, 
        $skip: this.lastEntry, 
        $limit: 20  
      }
      if(this.actCase!=null){
        expr.fallid=this.actCase.id
      }
      if(this.searchexpr && this.searchexpr.length>1){
        expr.$find=this.searchexpr
      }
      this.konsultationService.find({ query: expr}).then(result => {
        this.lastEntry += result.data.length
        this.encounters.data = this.encounters.data.concat(result.data)
      })
      this.caseManager.loadCasesFor(id).then(result => {
        this.cases = result
      })

    } else {
      this.encounters.data = []
      this.cases = []
    }
  }
}
