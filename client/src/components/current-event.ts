import { bindable } from 'aurelia-framework';
import { IEvent } from 'models/event-model';
import './components.scss'

export class CurrentEvent{
  @bindable event:IEvent
}
