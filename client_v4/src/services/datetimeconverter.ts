import { autoinject } from 'aurelia-dependency-injection';
import { I18N } from 'aurelia-i18n';
import { valueConverter } from "aurelia-binding";
import * as moment from 'moment';

@autoinject
@valueConverter('datetime')
export class DateTimeValueComverter {
  constructor(private i18: I18N) { }

  toView(val: string) {
    const mom = moment(val)
    return mom.format(this.i18.tr('adapters.date_format'))
  }
}
