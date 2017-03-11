import {customElement} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import * as moment from 'moment'
import 'moment/locale/de'
import Pikaday = require("pikaday");
import {inject} from 'aurelia-framework'
import {I18N} from 'aurelia-i18n'


@customElement('pickdate')
@inject(EventAggregator, Element, I18N)
export class PickDate {
  pikhome:HTMLInputElement
  element:any
  private pa:Pikaday
  private calendarNames = {
    previousMonth: this.tr.tr('calendar.previousMonth'),
    nextMonth: this.tr.tr('calendar.nextMonth')
  }


  constructor(private ea:EventAggregator, element, private tr:I18N) {
    this.element = element;
    let months = []
    for (let i = 0; i < 12; i++) {
      months.push(this.tr.tr('calendar.months.' + i)
      )
    }
    this.calendarNames['months'] = months
    let weekdays = []
    let weekdaysShort = []
    for (let i = 0; i < 7; i++) {
      weekdays.push(this.tr.tr('calendar.weekdays.' + i))
      weekdaysShort.push(this.tr.tr('calendar.weekdaysShort.' + i))

    }
    this.calendarNames['weekdays'] = weekdays
    this.calendarNames['weekdaysShort'] = weekdaysShort
  }

  attached() {
    let i18 = this.calendarNames
    let ea = this.ea
    this.pa = new Pikaday({
      field: this.pikhome,
      i18n: i18,
      position: "bottom right",
      format: "DD.MM.YYYY",
      onSelect: function () {
        console.log("selected " + this.getDate())
        ea.publish('datepicker', {oldDate: new Date(), newDate: this.getDate()})
      }
    })
  }

  forward() {
    let act = moment(this.pa.getDate())
    act.add(1, "days")
    this.pa.setDate(act.format())
  }

  back() {
    let act = moment(this.pa.getDate())
    act.add(-1, "days")
    this.pa.setDate(act.format())
  }
}