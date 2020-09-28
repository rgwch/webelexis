/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { observable } from 'aurelia-framework';
import '../../../proprietary/mobiscroll.javascript.scss';
import * as mobiscroll from '../../../proprietary/mobiscroll.javascript.min.js'

// https://demo.mobiscroll.com/jquery/eventcalendar/listview-rendering

import { bindable, bindingMode, inlineView, autoinject } from 'aurelia-framework';

@autoinject
export class Calendar {
  @bindable setDay: (event, instance, resource?) => boolean
  @bindable setMonth: (event, instance, resource?) => {}
  @bindable eventSelected: (event, instance) => {}
  @bindable resources: Array<string> = ["test"]
  @observable searchTriggered: string

  bereich
  instance
  mode

  constructor(private cal: Element) {

  }

  searchTriggeredChanged() {
    alert("search " + this.searchTriggered)
  }

  attached() {
    this.instance = mobiscroll.eventcalendar(this.cal, {
      lang: 'de',
      noEventsText: 'Keine Termine',
      eventsText: 'Termine',
      eventText: 'Termin',
      display: 'inline',
      showEventCount: true,
      theme: 'ios',
      buttons: [{ text: "Neuer Termin", handler: this.newAppnt }],
      view: {
        calendar: {
          type: 'month',
          size: 1
        }/*,
        eventList: {
          type: 'day',
          size: 1,
          scrollable: true
        }*/
      },
      onBeforeShow: (event, inst) => {
        const dat = new Date()
        this.setMonth({ firstDay: dat }, inst, this.bereich)
      },
      onDayChange: this.setDay,
      onPageChange: this.setMonth,
      onEventSelect: this.eventSelected
    })
    this.mode = "month"
  }

  /**
   * The user clicked one of the selector buttons
   * @param mode 
   */
  display(mode: string) {
    this.mode = mode
    this.instance.option({
      view: {
        calendar: ({ type: mode, size: 1 })
        // eventList: { type: "day", scrollable: true }
      }
    })
  }

  selected() {

    this.setDay(null, this.instance, this.bereich)
    this.setMonth(null, this.instance, this.bereich)
  }
  newAppnt() {
    alert("New Appointment")
  }
}
