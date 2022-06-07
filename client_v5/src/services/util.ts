import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'

let trl;
_.subscribe(m => trl = m)

const ELEXISDATETIME = "yyyyLLddhhmmss"
const ELEXISDATE = "yyyyLLdd"
const LOCALDATE = trl("formatting.date")

export default {
  ELEXISDATETIME, ELEXISDATE, LOCALDATE,
  ElexisDateToLocalDate: (elexisdate: string) => DateTime.fromFormat(elexisdate, ELEXISDATE).toFormat(LOCALDATE),
  ElexisDateTimeToLocalDate: (elexisdate: string) => DateTime.fromFormat(elexisdate, ELEXISDATETIME).toFormat(LOCALDATE),
  DateToElexisDate: (date: Date) => DateTime.fromJSDate(date).toFormat(ELEXISDATE),
  DateObjectToLocalDate: (date: Date) => DateTime.fromJSDate(date).toFormat(LOCALDATE)

}

