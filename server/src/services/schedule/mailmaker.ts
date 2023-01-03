/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { DateTime } from 'luxon'
import ical from 'ical-generator'
import { Mailer } from '../../util/mailer'

/**
 * Create a mail with an ICAL event as attachment
 */
export default function (app, data) {
    const sched = app.get("schedule");
    const mailer = new Mailer(app.get("smtp"), sched.sitename + ` <${sched.sitemail}>`)
    const termin = JSON.parse(data.appnt)
    const dt = DateTime.fromFormat(termin.tag, "yyyyLLdd").setZone('local')
    const minutes = parseInt(termin.beginn)
    const tstart = dt.plus({ minutes })
    const day = tstart.weekday
    const wday = ['Montag', 'Dienstag', "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][day - 1]
    const daystring = wday + ", " + tstart.toFormat("dd.LL.yyyy, HH:mm")
    const body = sched.confirm.replace("{*}", daystring)
    const atidx = sched.sitemail.indexOf('@')
    const domain = sched.sitemail.substr(atidx + 1)
    const cal = ical({ domain, name: "Arzttermin" })
    cal.method('PUBLISH').prodId({
        company: sched.sitename,
        product: "Terminvereinbarung",
        language: "DE"
    }).createEvent({
        start: tstart.toJSDate(),
        end: tstart.plus({ minutes: 20 }).toJSDate(),
        description: "Arzttermin " + sched.sitename,
        summary: "Bestätigung",
        location: sched.siteaddr,
        timezone: "Europe/Zurich"
    })

    mailer.send(data.email, "Terminbestätigung " + sched.sitename, body, null,cal.toString())
}
