/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { useView, PLATFORM, bindable, autoinject, computedFrom } from "aurelia-framework";
import { FindingsManager, FindingsModel } from "models/findings-model";
import { DataSource, DataService } from "services/datasource";
import { DialogService } from "aurelia-dialog";
import { AddFinding } from 'dialogs/add-finding'

/**
 * Display a single Finding type and allow to add, select, delete and display measrurements
 */
//@useView(PLATFORM.moduleName('components/workflow/finding-view.pug'))
@autoinject
export class FindingView {
  @bindable finding: {
    name: string
    title: string
    id: string
    measurements: Array<{
      date: Date,
      values: Array<number | string>
    }>
  }

  private findingService: DataService
  private isOpen: boolean = false
  private definitions

  constructor(private fm: FindingsManager, private ds: DataSource, private dgs: DialogService) {
    this.findingService = ds.getService('findings')
    this.definitions = fm.getDefinitions()
  }

  displayLine(row) {
    const def = this.definitions[this.finding.name]
    if (def && def.compact) {
      return def.compact(row)
    } else if (def.verbose) {
      return def.verbose(row)
    } else {
      return row
    }
  }
  attached() {
    this.findingService.on('updated', this.checkUpdate)
    this.findingService.on('removed', this.checkUpdate)
  }
  detached() {
    this.findingService.off('updated', this.checkUpdate)
    this.findingService.off('removed', this.checkUpdate)
  }

  /**
   * Menuoption: Add Measurement
   */
  addItem() {
    this.fm.fetch(this.finding.name, null).then(item => {
      if (item) {
        this.dgs.open({ viewModel: AddFinding, model: item }).whenClosed(result => {
          if (!result.wasCancelled) {
            this.fm.saveFinding(result.output)
          }
        })
      }
    })
  }
  /**
   * Menuoption: select all measurements
   */
  selectAll() {
    for (const m of this.finding.measurements) {
      m['selected'] = true
    }
  }
  /**
   * Menuoption: Unselect all measurments
   */
  deselectAll() {
    for (const m of this.finding.measurements) {
      m['selected'] = false
    }
  }

  @computedFrom('finding.measurements')
  get disabled() {
    if (this.finding.measurements.some(m => m['selected'])) {
      return ""
    } else {
      return "disabled"
    }
  }
  /**
   * Menuoption: Delete selected meaurements (after confirmation)
   */
  delete() {
    if (this.finding.measurements.some(m => m['selected'])) {
      for (const m of this.finding.measurements) {
        if (m['selected']) {
          if (confirm(`delete ${m.date}?`)) {
            this.fm.removeFinding(this.finding.id, m.date)
          }
        }
      }
    }
  }

  chart() {
    if (this.finding.measurements.some(m => m['selected'])) {
      
    }
  }
  /**
   * Open and close display of measurements of a category
   */
  toggle() {
    this.isOpen = !this.isOpen
  }
  /**
   * React on update of finding-objects (Message from the service):
   * if it's "our" finding, update the list.
   */
  checkUpdate = (updated) => {
    //console.log(JSON.stringify(updated))
    //console.log(JSON.stringify(this.finding))
    if (updated.id === this.finding.id) {
      console.log("updated")
      this.finding.measurements = updated.measurements
    }
  }

}
