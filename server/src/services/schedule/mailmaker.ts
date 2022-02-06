/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { DateTime }  from 'luxon'
const ical=require('ical-generator')
const Mailer=require('../../util/mailer')

/**
 * Create a mail with an ICAL event as attachment
 */
export default function (cfg, data) {
    const mailer = new Mailer(cfg.smtp, cfg.schedule.sitename + ` <${cfg.schedule.sitemail}>`)
    const termin = JSON.parse(data.appnt)
    const dt=DateTime.fromFormat(termin.tag, "yyyyLLdd").setZone('local')
    const minutes=parseInt(termin.beginn)
    const tstart=dt.plus({minutes})
    const day = tstart.weekday
    const wday = ['Montag', 'Dienstag', "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][day - 1]
    const daystring=wday+", "+tstart.toFormat("dd.LL.yyyy, HH:mm")
    const body=cfg.schedule.confirm.replace("{*}",daystring)
    const atidx=cfg.schedule.sitemail.indexOf('@')
    const domain=cfg.schedule.sitemail.substr(atidx+1)
    const cal=ical({domain,name: "Arzttermin"})
    cal.method('publish').prodId({
        company: cfg.schedule.sitename,
        product: "Terminvereinbarung",
        language: "DE"
    }).createEvent({
        start: tstart.toJSDate(),
        end: tstart.plus({minutes:20}).toJSDate(),
        description: "Arzttermin "+cfg.sitename,
        location: cfg.schedule.siteaddr,
        timezone: "Europe/Zurich"
    })
    mailer.send(data.email, "Terminbestätigung " + cfg.sitename, body, cal.toString())
}
