/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { observable } from 'aurelia-framework';
import './mobiscroll.javascript.scss';
import * as mobiscroll from './mobiscroll.javascript.min.js'

// https://demo.mobiscroll.com/jquery/eventcalendar/listview-rendering

import { bindable, bindingMode, inlineView, autoinject } from 'aurelia-framework';

@autoinject
export class Calendar {
  @bindable setDay: (event, instance) => boolean
  @bindable setMonth: (event, instance) => {}
  @bindable eventSelected: (event, instance) => {}
  @bindable resources: Array<string> = ["test"]
  @observable searchTriggered: string


  bereich
  instance

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
        this.setMonth({ firstDay: dat }, inst)
      },
      onDayChange: this.setDay,
      onPageChange: this.setMonth,
      onEventSelect: this.eventSelected
    })
  }

  /**
   * The user clicked one of the selector buttons
   * @param mode 
   */
  display(mode: string) {
    this.instance.option({
      view: {
        calendar: (mode == 'day' ? undefined : { type: mode, size: 1 })
        // eventList: { type: "day", scrollable: true }
      }
    })
  }

  selected() {
    console.log(this.bereich)
  }
  newAppnt() {
    alert("New Appointment")
  }
}
