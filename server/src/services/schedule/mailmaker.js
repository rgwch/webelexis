const { DateTime } = require('luxon')
const ical=require('ical-generator')

module.exports = function (cfg, data) {
    const mailer = new (require('../../util/mailer'))(cfg.smtp, cfg.schedule.sitename + ` <${cfg.schedule.sitemail}>`)
    const termin = JSON.parse(data.appnt)
    const dt=DateTime.fromFormat(termin.tag, "yyyyLLdd")
    const minutes=parseInt(termin.beginn)
    const tstart=dt.plus({minutes})
    const day = tstart.weekday
    const wday = ['Montag', 'Dienstag', "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"][day - 1]
    const daystring=wday+", "+tstart.toFormat("dd.LL.yyyy, HH:mm")
    const body=cfg.schedule.confirm.replace("{*}",daystring)
    const atidx=cfg.schedule.sitemail.indexOf('@')
    const domain=cfg.schedule.sitemail.substr(atidx+1)
    cal=ical({domain,name: "Arzttermin"})
    cal.method('publish').createEvent({
        start: tstart.toJSDate(),
        end: tstart.plus({minutes:20}).toJSDate(),
        description: "Arzttermin "+cfg.sitename,
        location: cfg.schedule.siteaddr
    })
    mailer.send(data.email, "Terminbestätigung " + cfg.sitename, body, cal.toString())
}
