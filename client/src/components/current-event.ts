import { bindable } from 'aurelia-framework';
import { IEvent } from 'models/event-model';
import './components.css'

export class CurrentEvent{
  @bindable event:IEvent
}
