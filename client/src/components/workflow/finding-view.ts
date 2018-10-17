import { useView, PLATFORM, bindable, autoinject } from "aurelia-framework";
import { FindingsManager, FindingsModel } from "models/findings-model";
import { DataSource, DataService } from "services/datasource";
import defs from 'user/findings'
import findings from "user/findings";

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

  constructor(private fm: FindingsManager, ds: DataSource) {
    this.findingService = ds.getService('findings')
  }

  displayLine(row) {
    const def = defs[this.finding.name]
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

  selectAll() {
    for (const m of this.finding.measurements) {
      m['selected'] = true
    }
  }
  deselectAll() {
    for (const m of this.finding.measurements) {
      m['selected'] = false
    }
  }
  delete() {
    for (const m of this.finding.measurements) {
      if (m['selected']) {
        if(confirm(`delete ${m.date}?`)){
          this.fm.removeFinding(this.finding.id, m.date)
        }
      }
    }
  }
  toggle() {
    this.isOpen = !this.isOpen
  }
  checkUpdate = (updated) => {
    //console.log(JSON.stringify(updated))
    //console.log(JSON.stringify(this.finding))
    if (updated.id === this.finding.id) {
      console.log("updated")
      this.finding.measurements=updated.measurements
    }
  }

}
