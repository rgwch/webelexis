import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'

let trl;
_.subscribe(m => trl = m)

const ELEXISDATETIME = "yyyyLLddhhmmss"
const ELEXISDATE = "yyyyLLdd"
const LOCALDATE = trl("formatting.date")

export default {
  ELEXISDATETIME, ELEXISDATE, LOCALDATE,
  ElexisDateToLocalDate: (elexisdate: string): string => {
    const fmt = elexisdate.length == 8 ? ELEXISDATE : ELEXISDATETIME
    return DateTime.fromFormat(elexisdate, fmt).toFormat(LOCALDATE)
  },
  DateToElexisDate: (date: Date) => DateTime.fromJSDate(date).toFormat(ELEXISDATE),
  DateToElexisDateTime: (date: Date) => DateTime.fromJSDate(date).toFormat(ELEXISDATETIME),
  DateObjectToLocalDate: (date: Date) => DateTime.fromJSDate(date).toFormat(LOCALDATE)

}

