import { IPatient } from './../models/patient-model';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PatientManager } from '../models/patient-model';
import { autoinject, bindable } from 'aurelia-framework';
import { IViewerConfiguration } from './../forms/commonviewer';
import { I18N } from 'aurelia-i18n';

@autoinject
export class Patient {
  @bindable cfg:IViewerConfiguration={
    dataType: "patient",
    title: this.i18.tr("menu:patient"),
    searchFields:[
      {
        asPrefix: false,
        name: "$find",
        label: "Name, Vorname oder Geburtsdatum",
        value: "",
      }
    ],
    selectMsg: "patSelected",
    getLabel: obj=>this.pm.getLabel(obj)

  }
  actPatient:IPatient

  constructor(private i18:I18N, private pm: PatientManager, private ea:EventAggregator) {
    this.ea.subscribe(this.cfg.selectMsg,pat=>{
      this.actPatient=pat
    })
  }
}
