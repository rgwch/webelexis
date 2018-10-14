
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 List of elexis encounters of the currently selected patient
*/
import { bindable } from 'aurelia-framework';
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
const number_to_fetch=20;

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
  encounters = {
    total: 10000000,
    data: [],
    skip:0
  }
  cases = []
  lastEntry: number = 0
  private konsultationService: DataService
  private actPatient
  @observable actCase
  @observable searchexpr = "ha"
  encdom
  canCreate = true

  actPatientChanged(newValue, oldValue) {
    //console.log("act "+(this.actPatient ? this.actPatient.id : "empty"))
    //console.log("new: "+(newValue ? newValue.id: "empty"))
    //console.log("old: "+(oldValue ? oldValue.id: "empty"))
    this.actCase = null
    this.searchexpr = ""
    this.refresh()
  }

  actCaseChanged(newValue, oldValue) {
    this.refresh()
  }

  searchexprChanged(newval, oldval) {
    this.refresh()
  }

  constructor(private ds: DataSource, private caseManager: CaseManager, private we: WebelexisEvents) {
    this.konsultationService = this.ds.getService('konsultation')
  }

  attached() {
    this.konsultationService.on('created', this.consActions)
    this.konsultationService.on('updated', this.consActions)
    this.konsultationService.on('removed', this.consActions)
    this.refresh()
  }

  detached() {
    this.konsultationService.off('created', this.consActions)
    this.konsultationService.off('updated', this.consActions)
    this.konsultationService.off('deleted', this.consActions)
  }

  /**
   * On create, remove or update events just reload, if it's our business.
   */
  consActions = (obj: EncounterType) => {
    const concern = this.cases.find(fall => { return fall.id === obj.fallid })
    if (concern && (this.actCase == null || concern.id == this.actCase.id)) {
      this.refresh()
    }
  }

  /**
   * create a new encounter. A case must be selected
   */
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
      this.konsultationService.create(kons).then(result => {
        this.lastEntry = 0
      }).catch(err => {
        if (err.code == 400) {
          alert("The database could not handle the request. Please make sure that the server is running and that the database has the necessary modifications for webelexis.")
        }
        else {
          alert("Could not save")
        }
      })
    }
  }

  /**
   * reload the encounter list completely
   */
  refresh() {
    setTimeout(() => {
      this.encounters.total=1000000
      this.encounters.data = []
      this.encounters.skip=0
      this.lastEntry = 0
      // console.log("act: "+(this.actPatient ? this.actPatient.id : "empty"))
      this.fetchData(this.actPatient).then(result => {
        let act = this.encounters.data[0]
        if (act.eintrag.html.replace(/<.*?>/g, "") == "") {
          const children = this.encdom.getElementsByTagName("encounter")
          if (children && children.length > 0) {
            const lastKons = children[0]
            // TODO: Actuvate edit mode
          }
        }

      })
    })
  }


  /**
   * Fetch new data. The method is either called from actPatientChanged, then data of the new patient
   * must be loaded. Or it's called as CustomEvent from the EndlessScroll-widtget, then more data of the current patient and case must be fetched.
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
      /* 
       we load always  number_to_fetch items, beginning with lastEntry. 
       If lastEntry + number_to_fetch >= total
       we load only total-lastEntry and set lastEntry to total. On first call, total
       is unknown (but assumed very high)
       */
      const expr: any = {
        patientId: id,
        $skip: this.lastEntry,
        $limit: number_to_fetch
      }
      if ((this.lastEntry + number_to_fetch) > this.encounters.total) {
        expr.$limit = this.encounters.total - this.lastEntry
      }
      
      //  if a case (Fall) is selected, fetch only encounters for that case
      if (this.actCase != null) {
        expr.fallid = this.actCase.id
      }
      // if a searchexpression is given, use it
      if (this.searchexpr && this.searchexpr.length > 1) {
        expr.$find = this.searchexpr
      }
      const elms = []
      if (expr.$limit > 0) {
        console.log(`Lastitem: ${this.lastEntry}, total: ${this.encounters.total}, loading: `+JSON.stringify(expr))
        elms.push(this.konsultationService.find({ query: expr }).then(result => {
          this.encounters.data = this.encounters.data.concat(result.data)
          this.encounters.total=result.total
          this.lastEntry = this.encounters.data.length

        }))
      }else{
        console.log("no reloading")
      }
      elms.push(this.caseManager.loadCasesFor(id).then(result => {
        this.cases = result
      }))
      return Promise.all(elms).then(r => {
        return true
      })
    } else {
      this.encounters.data = []
      this.cases = []
      return Promise.resolve(true)
    }
  }
}
