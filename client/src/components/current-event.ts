import { bindable } from 'aurelia-framework';
import { IEvent } from 'models/event-model';
export class CurrentEvent{
  @bindable event:IEvent
}
