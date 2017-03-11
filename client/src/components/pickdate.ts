import {customElement} from 'aurelia-framework'
import * as moment from 'moment'
import 'moment/locale/de'
import Pikaday = require("pikaday");

@customElement('pickdate')
export class PickDate {
  pikhome:HTMLInputElement
  element:any
  private calendarNames = {
    previousMonth: 'voriger Monat',
    nextMonth: 'nächster Monat',
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  }


  public static = [Element];

  constructor(element) {
    this.element = element;
    let now=moment().format("DD.MM.YYYY")
    console.log(now)
  }

  attached() {
    let i18 = this.calendarNames
    let pa = new Pikaday({field: this.pikhome,
      i18n:i18,
      position:"bottom right",
      format:"DD.MM.YYYY",
      onSelect: function(){
        console.log("selected "+this.getDate())
      }})
  }
}