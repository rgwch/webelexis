import v from './views'
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class TestIndex{
  views=[v.edit,v.scroll,v.kons,v.findings,v.grafik,v.dragdrop,v.smartlist, v.medication, v.brief]

  constructor(private ea:EventAggregator){

  }

  attached(params){
    //console.log(params)
  }
  switchTo(view){
    this.ea.publish("testdetail",view)
  }
}
