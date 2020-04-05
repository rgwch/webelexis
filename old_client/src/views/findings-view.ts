/********************************************
 * This file is part of Webelexis           *
 * Copyright (c)  2018 by G. Weirich        *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, bindable, PLATFORM, useView } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";
import { FindingsManager, FindingsModel } from "../models/findings-model";

/**
 * Display Findings for the currently selected patient
 */
@connectTo(store => store.state.pipe(pluck("patient") as any))
// @useView(PLATFORM.moduleName('components/workflow/findings-view.pug'))
@autoinject
export class FindingsView {
  private findingGroups = []; // needed for the view
  private state;

  constructor(private findingsManager: FindingsManager) {}

  public stateChanged(newPatient, oldPatient) {
    this.loadFindings();
  }

  private async loadFindings() {
    const groups = await this.findingsManager.getFindingNames();
    const ng = [];
    for (const group of groups) {
      const findingElement: FindingsModel = await this.findingsManager.getFindings(
        group[0],
        this.state.id
      );
      const measurements = findingElement
        ? await findingElement.getMeasurements()
        : [];
      ng.push({
        id: findingElement ? findingElement.f.id : undefined,
        measurements,
        name: group[0],
        title: group[1]
      });
      this.findingGroups = ng;
    }
  }
}
