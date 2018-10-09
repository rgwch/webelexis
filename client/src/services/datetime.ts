/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import {I18N} from 'aurelia-i18n'
import {inject} from 'aurelia-framework'
import * as moment from 'moment'

@inject(I18N)
export class DateTime {

  constructor(private i18) {
  }

  public DateToElexisDate(date:Date):string{
    return moment(date).format("YYYYMMDD")
  }

  public ElexisDateToLocalDate(yyyymmdd:string):string{
    return moment(yyyymmdd,"YYYYMMDD").format(this.i18.tr('adapters.date_format'))
  }

  public DateObjectToLocalDate(date:Date):string{
    return moment(date).format(this.i18.tr('adapters.date_format'))
  }
  /*
  public toDate(mom: string):string {
    return moment(mom).format(this.i18.tr('adapters.date_format'))
  }
  */

  public minutesToTimeString(minutes:number):string{
    let hours:number = Math.floor(minutes / 60)
    let rest:number = minutes - (hours * 60)
    let mins:string = rest.toString()
    let hoursS:string = hours.toString()
    if (hoursS.length < 2) {
      hoursS = "0" + hours
    }
    if (mins.length < 2) {
      mins = "0" + mins
    }

    return hoursS + ":" + mins
  }
}
