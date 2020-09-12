import { I18N } from 'aurelia-i18n';
import { valueConverter } from "aurelia-binding";
import * as moment from 'moment'
import { autoinject } from "aurelia-framework";

@autoinject
@valueConverter('momentToString')
export class MomentToStringValueConverter {

  constructor(private i18: I18N) { }

  toView(mom: moment.Moment) {
    mom = mom || moment()
    return mom.format(this.i18.tr('adapters.time_format'))
  }

  fromView(str) {
    return moment(str, this.i18.tr('adapters.time_format'))
  }
}

@valueConverter('momentToPercent')
export class MomentToPercent {

  toView(val: moment.Moment, from: moment.Moment, duration: number) {
    if (val) {
      const now = val.hour() * 60 + val.minute()
      const dist = now - from.minute()
      const percent = 100 * dist / duration
      return percent
    }else{
      return 0
    }
  }

  
  fromView(percent: number, from: moment.Moment, duration: number) {
    const abs = from.minute() + (duration / 100 * percent)
    const hours = Math.round(abs / 60)
    const mins = abs - (60 * hours)
    const ret = from.clone()
    ret.hours(hours)
    ret.minutes(mins)
    return ret
  }
  
}
