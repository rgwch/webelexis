import {Config} from '../config'
import {EventAggregator} from 'aurelia-event-aggregator'
import {autoinject,customElement} from 'aurelia-framework'

@customElement('pickresource')
@autoinject
export class PickResource{
  private actors:Array<any>
  private selectedActor

  constructor(private cfg:Config, private ea:EventAggregator){
    this.actors = cfg.general.actors
  }

  selectionChanged(){
    this.ea.publish("pickresource",this.selectedActor)
  }
}