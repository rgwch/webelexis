import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import v from './views'
import { DataSource, DataService } from '../../services/datasource';
import { WebelexisEvents } from '../../webelexisevents';

@autoinject
export class Detail {
  views = [v.edit, v.scroll, v.findings, v.kons, v.dragdrop, v.smartlist, v.medication,v.brief]
  active = v.kons
  style = "position:absolute;left:180px;right:85px;"
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
    this.patService = ds.getService('patient')
    this.caseService = ds.getService('fall')
    this.konsService = ds.getService('konsultation')
  }

  activate(params) {
    if (params.vi) {
      const actview = this.views.find(v => v.name.toLowerCase() == params.vi)
      this.active = actview
    }
    return this.patService.find({ query: { TitelSuffix: "unittest" } }).then(p => {
      if (!p || !p.data || p.data.length < 1) {
        alert("No Patient for testing found")
      }
      this.actPatient = p.data[0]
      this.actPatient.type = "patient"
      this.we.selectItem(this.actPatient)
      return this.actPatient
    }, reject => {
      alert(reject)
    }).then(pat => {
      return this.caseService.find({ query: { patientid: pat.id } }).then(cas => {
        if (!cas || !cas.data || cas.data.length < 1) {
          alert("No Case for testing found")
        }
        this.actCase = cas.data[0]
        return this.actCase
      })
    }).then(cas => {
      return this.konsService.find({ query: { fallid: cas.id } }).then(kons => {
        if (!kons || !kons.data || kons.data.length < 1) {
          alert("No encounter for testing found")
        }
        
        this.actKons = kons.data[0]
        this.actKons.type = "konsultation"
        this.we.selectItem(this.actKons)
        return this.actKons
      })
    })
  }

  switchTo(view) {
    this.active = view
  }
}
