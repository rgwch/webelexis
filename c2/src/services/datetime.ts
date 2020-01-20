/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import * as moment from "moment";

export class DateTime {


  /**
   * convert a Date object to a YYYYMMDD string
   * @param date 
   */
  public DateToElexisDate(date: Date): string {
    return moment(date).format("YYYYMMDD");
  }

  /**
   * convert a Date object to a YYYYMMDDHHmm string
   * @param date 
   */
  public DateToElexisDateTime(date: Date): string {
    return moment(date).format("YYYYMMDDHHmm");
  }

  /**
   * convert a YYYYMMDD string to a Date object
   * @param yyyymmdd 
   */
  public ElexisDateToDate(yyyymmdd: string): Date {
    if (yyyymmdd) {
      return moment(yyyymmdd, "YYYYMMDD").toDate()
    } else {
      return moment().toDate()
    }
  }

  /**
   * Convert a YYYYMMDDHHmm or a YYYYMMDDHHmmSS to a Date object
   * @param yyyymmddhhmmss 
   */
  public ElexisDateTimeToDate(yyyymmddhhmmss: string): Date {
    if (yyyymmddhhmmss.length == 14) {
      return moment(yyyymmddhhmmss, "YYYYMMDDHHmmSS").toDate()
    } else if (yyyymmddhhmmss.length == 12) {
      return moment(yyyymmddhhmmss, "YYYYMMDDHHmm").toDate()
    }
    else {
      return moment().toDate();
    }
  }


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



  public isValidLocalDate(dmy) {
    return (moment(dmy, "D.M.YYYY")).isValid()
  }
}
