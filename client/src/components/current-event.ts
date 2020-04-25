import { bindable } from 'aurelia-framework';
import { IEvent } from '../models/event-manager';
import './components.scss'

export class CurrentEvent{
  @bindable event:IEvent
}
