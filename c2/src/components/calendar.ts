import { bindable, bindingMode, inlineView } from 'aurelia-framework';
const mobi=window['mobiscroll']

@inlineView(`
<template>
  <div ref="ed"></div>
</template>
`)
export class Calendar{
  constructor(private cal:Element){

  }

  attached(){
    mobi.eventcalendar(this.cal,{
      lang: 'de',
      display: 'inline',
      theme: 'mobiscroll',
      view:{
        calendar: {
          type: 'month',
          size: 1
        }
      },
      eventList: {
        type: 'day',
        size: 1
      }
    })
  }

}
