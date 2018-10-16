/********************************************
 * This file is part of Webelexis           *
 * Copyright (c)  2018 by G. Weirich        *
 * License and Terms see LICENSE            *
 ********************************************/

import {FindingsManager, FindingsModel} from '../../models/findings-model'
import { bindable, useView, PLATFORM, autoinject } from 'aurelia-framework';
import defs from '../../user/findings'
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

@connectTo(store=>store.state.pipe(<any>pluck('patient')))
@useView(PLATFORM.moduleName('./findings-view.pug'))
@autoinject
export class FindingsView{
  private findingGroups=[]
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
        measurements: measurements
      })
      this.findingGroups=ng
    }
  }
}
