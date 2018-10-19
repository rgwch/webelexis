/********************************************
 * This file is part of Webelexis           *
 * Copyright (c)  2018 by G. Weirich        *
 * License and Terms see LICENSE            *
 ********************************************/

import {FindingsManager, FindingsModel} from '../../models/findings-model'
import { bindable, useView, PLATFORM, autoinject } from 'aurelia-framework';
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

/**
 * Display Findings for the currently selected patient
 */
@connectTo(store=>store.state.pipe(<any>pluck('patient')))
//@useView(PLATFORM.moduleName('components/workflow/findings-view.pug'))
@autoinject
export class FindingsView{
  private findingGroups=[] // needed for the view
  private state;

  stateChanged(newPatient,oldPatient){
    this.loadFindings()
  }

  constructor(private findingsManager:FindingsManager){}

  async loadFindings(){
    const groups=await this.findingsManager.getFindingNames()
    const ng=[]
    for(const group of groups){
      const findingElement:FindingsModel=await this.findingsManager.getFindings(group[0],this.state.id)
      const measurements=findingElement ? await findingElement.getMeasurements()  : []
      ng.push({
        name: group[0],
        title: group[1],
        id: (findingElement ? findingElement.f.id : undefined),
        measurements: measurements
      })
      this.findingGroups=ng
    }
  }
}
