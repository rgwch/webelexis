import v from './views'
import { switchMapTo } from 'rxjs/operators';
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class TestIndex{
  views=[v.edit,v.scroll,v.kons]

  constructor(private ea:EventAggregator){

  }

  attached(params){
    //console.log(params)
  }
  switchTo(view){
    this.ea.publish("testdetail",view)
  }
}
