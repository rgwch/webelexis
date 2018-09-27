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
import { autoinject } from 'aurelia-framework';

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(pluck('patient')),
    //actCase: store=>store.state.pipe(pluck('case')),
    actKons: store => store.state.pipe(pluck('konsultation'))
  }
})
@autoinject
export class Encounters {
  encounters = { data: [] }
  lastEntry: number = 0
  private konsultationService:DataService
  private actPatient

  actPatientChanged(newValue,oldValue){
    this.encounters.data=[]
    this.lastEntry=0
    this.fetchData(newValue)
  }
  constructor(private ds:DataSource) {
    this.konsultationService=this.ds.getService('konsultation')
  }

  attached() {
  }


  fetchData(ev) {
    let id=ev.id
    if (ev instanceof CustomEvent) {
      id=this.actPatient.id
    }
      this.konsultationService.find({ query: { "patientId": id, $skip: this.lastEntry, $limit: 20 } }).then(result => {
        this.lastEntry += result.data.length
        this.encounters.data = this.encounters.data.concat(result.data)
      })
    }
}
