import { bindable, bindingMode, inlineView, autoinject } from 'aurelia-framework';
const mobi=window['mobiscroll']

@autoinject
@inlineView(`
<template>
  <div ref="cal"></div>
</template>
`)
export class Calendar{
  @bindable setDay: (event,instance)=>boolean
  @bindable setMonth: (event,instance)=>{}
  @bindable eventSelected: (event,instance)=>{}

  constructor(private cal:Element){

  }

  attached(){
    mobi.eventcalendar(this.cal,{
      lang: 'de',
      display: 'inline',
      theme: 'bootstrap',
      view:{
        calendar: {
          type: 'month',
          size: 1
        },
        eventList: {
          type: 'day',
          size: 1
        }
      },
      onBeforeShow: (event,inst)=>{
        const dat=new Date()
        this.setMonth({firstDay: dat},inst)    
      },
      onDayChange: this.setDay,
      onPageChange: this.setMonth,
      onEventSelect: this.eventSelected
    })
  }


}
