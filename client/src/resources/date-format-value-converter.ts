import * as moment from 'moment';
import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';


@inject(I18N)
export class DateFormatValueConverter {

  constructor(private t) {}

  /**
   * convert a Date-String in to a localized representation
   * @param value the value to convert
   * @param mode one of "date","time", or "full"
   * @returns {string} the localized representation or "" if the value could not be converted
   */
  public toView(value, mode = "full") {
    let ret = ""
    if (mode === "full") {
      ret = moment(value).format(this.t.tr('adapters.datetime_format'));
    } else if (mode === "date") {
      ret = moment(value).format(this.t.tr('adapters.date_format'));
    } else {
      ret = moment(value).format(this.t.tr('adapters.time_format'));
    }
    return ret ? (ret.startsWith("Invalid") ? "" : ret) : ""
  }

  public fromView(value, mode = "full") {
    return moment(value).format()
  }
}
