import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import v from './views'
import { DataSource, DataService } from '../../services/datasource';
import { WebelexisEvents } from '../../webelexisevents';

@autoinject
export class Detail {
  views = [v.edit, v.scroll, v.kons]
  active = v.kons
  style = "position:absolute;left:180px;right:85px;"
  patService: DataService
  actPatient

  constructor(private ea: EventAggregator, private ds: DataSource, private we: WebelexisEvents) {
    this.ea.subscribe("testdetail", (v) => {
      this.switchTo(v)
    })
    this.patService = ds.getService('patient')
  }

  activate(params) {
    if (params.vi) {
      const actview = this.views.find(v => v.name.toLowerCase() == params.vi)
      this.active = actview
    }
    return this.patService.find({ query: { bezeichnung1: "unittest" } }).then(p => {
      if (!p || !p.data || p.data.length < 1) {
        alert("No Patient for testing found")
      }
      this.actPatient = p.data[0]
      this.we.selectItem(this.actPatient)
    },reject=>{
      alert(reject)
    })
  }

  switchTo(view) {
    this.active = view
  }
}
