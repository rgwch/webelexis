import { useView, PLATFORM, bindable, autoinject } from "aurelia-framework";
import { FindingsManager, FindingsModel } from "models/findings-model";
import { DataSource, DataService } from "services/datasource";
import defs from 'user/findings'
import findings from "user/findings";

//@useView(PLATFORM.moduleName('components/workflow/finding-view.pug'))
@autoinject
export class FindingView {
  @bindable finding: {
    name: string,
    title: string,
    measurements: Array<{
      date: Date,
      values: Array<number | string>
    }
    >
  }

  private findingService: DataService
  private isOpen:boolean=false
  private num:number=undefined
  
  constructor(private fm: FindingsManager, ds: DataSource) {
    this.findingService = ds.getService('finding')
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
  }
  detached() {
    this.findingService.off('updated', this.checkUpdate)
  }

  toggle(){
    this.isOpen=!this.isOpen
  }
  checkUpdate = (updated) => {
    if (updated.title == this.finding.title) {
      console.log("updated")
    }
  }

}
