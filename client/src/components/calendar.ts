/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { observable } from 'aurelia-framework';

// https://demo.mobiscroll.com/jquery/eventcalendar/listview-rendering

import { bindable, bindingMode, inlineView, autoinject } from 'aurelia-framework';
const mobi = window['mobiscroll']

@autoinject
export class Calendar {
  @bindable setDay: (event, instance) => boolean
  @bindable setMonth: (event, instance) => {}
  @bindable eventSelected: (event, instance) => {}
  @observable searchTriggered: string


  instance

  constructor(private cal: Element) {

  }

  searchTriggeredChanged() {
    alert("search " + this.searchTriggered)
  }

  attached() {
    this.instance = mobi.eventcalendar(this.cal, {
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
        },
        eventList: {
          type: 'day',
          size: 1,
          scrollable: true
        }
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

  display(mode: string) {
    this.instance.option({
      view: {
        calendar: (mode == 'day' ? undefined : { type: mode, size: 1 }),
        eventList: { type: "day", scrollable: true }
      }
    })
  }
  newAppnt(){
    alert("New Appointment")
  }
}
