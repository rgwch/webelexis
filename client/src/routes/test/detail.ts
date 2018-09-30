import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from "aurelia-framework";
import v from './views'

@autoinject
export class Detail{
  views=[v.edit,v.scroll,v.kons]
  active=v.kons
  style="position:absolute;left:180px;right:85px;"

  constructor(private ea:EventAggregator){
    this.ea.subscribe("testdetail",(v)=>{
      this.switchTo(v)
    })
  }

  switchTo(view){
    this.active=view
  }
}
