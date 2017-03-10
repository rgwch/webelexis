import {bindable, ObserverLocator, autoinject} from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator'

@autoinject
export class Datepicker {
  @bindable pickerDate: string
  observer
  subscription

  constructor(private ea: EventAggregator, private observerLocator: ObserverLocator) {
    this.observer = this.observerLocator.getObserver(this, 'pickerDate')
    this.subscription = this.observer.subscribe((newValue, oldValue) => {
      this.ea.publish("datepicker", {oldDate: oldValue, newDate: newValue})
    })

  }

  advancedOptions = {
    monthsFull   : ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort  : ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysFull : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    today        : 'Heute',
    clear        : 'Löschen',
    close        : 'Schließen',
    firstDay     : 1,
    format       : 'dddd, dd. mmmm yyyy',
    formatSubmit : 'yyyy/mm/dd',
    closeOnSelect: true,
    closeOnClear : true
  };
}