/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DateTime } from 'luxon'
import './i18n/i18n'
import { _ } from 'svelte-i18n'

let trl;
_.subscribe(m => trl = m)

const ELEXISDATETIME = "yyyyLLddhhmmss"
const ELEXISDATE = "yyyyLLdd"
const LOCALDATE = trl("formatting.date")

export default {
  ELEXISDATETIME, ELEXISDATE, LOCALDATE,
  ElexisDateToLocalDate: (elexisdate: string): string => {
    if (elexisdate) {
      const fmt = elexisdate.length == 8 ? ELEXISDATE : ELEXISDATETIME
      return DateTime.fromFormat(elexisdate, fmt).toFormat(LOCALDATE)
    } else {
      console.log("empty date in util.ElexisDateToLocalDate")
      return "01.01.1900"
    }
  },
  ElexisDateToISODate: (elexisdate: string): string => {
    const fmt = elexisdate.length == 8 ? ELEXISDATE : ELEXISDATETIME
    return DateTime.fromFormat(elexisdate, fmt).toISO()
  },
  DateToElexisDate: (date: Date) => DateTime.fromJSDate(date).toFormat(ELEXISDATE),
  DateToElexisDateTime: (date: Date) => DateTime.fromJSDate(date).toFormat(ELEXISDATETIME),
  DateObjectToLocalDate: (date: Date) => DateTime.fromJSDate(date).toFormat(LOCALDATE),
  LuxonToLocalDate: (date: DateTime): string => date.toFormat(LOCALDATE),
  LuxonToElexisDate: (date: DateTime): string => date.toFormat(ELEXISDATE),
  ElexisDateToLuxon: (elexisdate: string): DateTime => {
    if (elexisdate.length == ELEXISDATETIME.length) {
      return DateTime.fromFormat(elexisdate, ELEXISDATETIME)
    } else if (elexisdate.length == ELEXISDATE.length) {
      return DateTime.fromFormat(elexisdate, ELEXISDATE)
    } else {
      throw new Error("Bad input for ElexisDateToLuxon")
    }
  },
  normalizeLength(date: string, model: string) {
    if (date.length < model.length) {
      return date.padEnd(model.length, "0")
    } else if (date.length > model.length) {
      return date.substring(0, model.length)
    }
  }
}

