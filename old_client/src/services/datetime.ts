/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import * as moment from "moment";

@inject(I18N)
export class DateTime {
  constructor(private i18) {}

  public DateToElexisDate(date: Date): string {
    return moment(date).format("YYYYMMDD");
  }

  public DateToElexisDateTime(date: Date): string {
    return moment(date).format("YYYYMMDDHHmmSS");
  }
  public ElexisDateToLocalDate(yyyymmdd: string): string {
    if (yyyymmdd) {
      return moment(yyyymmdd, "YYYYMMDD").format(
        this.i18.tr("adapters.date_format")
      );
    } else {
      return moment().format(this.i18.tr("adapters.date_format"));
    }
  }

  public localDateToElexisDate(ddmmyy: string) {
    return moment(ddmmyy, this.i18.tr("adapters.date_format")).format(
      "YYYYMMDD"
    );
  }

  public isValidLocalDate(dmy){
    return (moment(dmy, "D.M.YYYY")).isValid()
  }
  public ElexisDateTimeToLocalDate(yyyymmddhhmmss: string): string {
    if (yyyymmddhhmmss) {
      return moment(yyyymmddhhmmss, "YYYYMMDDHHmmSS").format(
        this.i18.tr("adapters.date_format")
      );
    } else {
      return moment().format(this.i18.tr("adapters.date_format"));
    }
  }
  public DateObjectToLocalDate(date: Date): string {
    return moment(date).format(this.i18.tr("adapters.date_format"));
  }
  /*
  public toDate(mom: string):string {
    return moment(mom).format(this.i18.tr('adapters.date_format'))
  }
  */

  public minutesToTimeString(minutes: number): string {
    const hours: number = Math.floor(minutes / 60);
    const rest: number = minutes - hours * 60;
    let mins: string = rest.toString();
    let hoursS: string = hours.toString();
    if (hoursS.length < 2) {
      hoursS = "0" + hours;
    }
    if (mins.length < 2) {
      mins = "0" + mins;
    }

    return hoursS + ":" + mins;
  }
}
