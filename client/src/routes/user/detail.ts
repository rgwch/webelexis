import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import v from './views'
import { DataSource, DataService } from '../../services/datasource';
import { WebelexisEvents } from '../../webelexisevents';

@autoinject
export class Detail {
  views = [v.login,v.lostpwd]
  active = v.login
  style = "position:absolute;left:185px;right:15px;top:20px;"
  patService: DataService
  caseService: DataService
  konsService: DataService
  actPatient
  actCase
  actKons

  constructor(private ea: EventAggregator, private ds: DataSource, private we: WebelexisEvents) {
    this.ea.subscribe("testdetail", (v) => {
      this.switchTo(v)
    })
  }

  activate(params) {
    if (params.vi) {
      const actview = this.views.find(v => v.name.toLowerCase() == params.vi)
      this.active = actview
    }
  }

  switchTo(view) {
    this.active = view
  }
}
