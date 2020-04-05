/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import * as moment from "moment";

@autoinject
export class DateFormatValueConverter {
  constructor(private t: I18N) {}

  /**
   * convert a Date-String into a localized representation
   * @param {number} value the value to convert
   * @param {"full" | "date" | "time"} mode  defaults to "full"
   * @returns {string} the localized representation or "" if the value could not be converted
   */
  public toView(value: string, mode: "full" | "date" | "time" = "full") {
    let ret = "";
    if (mode === "full") {
      ret = moment(value).format(this.t.tr("adapters.datetime_format"));
    } else if (mode === "date") {
      ret = moment(value).format(this.t.tr("adapters.date_format"));
    } else {
      ret = moment(value).format(this.t.tr("adapters.time_format"));
    }
    return ret ? (ret.startsWith("Invalid") ? "" : ret) : "";
  }

  public fromView(value: string, mode: "full" | "date" | "time" = "full") {
    switch (mode) {
      case "full":
        return moment(
          value,
          this.t.tr("adapters.datetime_format_parse")
        ).format();
      case "date":
        return moment(value, this.t.tr("adapters.date_format_parse")).format();
      case "time":
        return moment(value, this.t.tr("adapters.time_format_parse")).format();
      default:
        return moment(value).format();
    }
  }
}
