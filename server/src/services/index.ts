/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import elexisConfig from './elexis-config/elexis-config.service'
import admin from './admin/admin.service'
import user from './user/user.service'
import kontakt from './kontakt/kontakt.service'
import agntermine from './agntermine/agntermine.service'
import patient from './patient/patient.service'
import fall from './fall/fall.service'
import konsultation from './konsultation/konsultation.service'
import article from './article/article.service'
import elexisUserconfig from './elexis-userconfig/elexis-userconfig.service'
import prescriptions from './prescriptions/prescriptions.service'
import auf from './auf/auf.service'
import createpdf from './createpdf/createpdf.service'
import macros from './macros/macros.service'
import labresults from './labresults/labresults.service'
import findings from './findings/findings.service'
import stickers from './stickers/stickers.service'
import billing from './billing/billing.service'
import tarmed from './tarmed/tarmed.service'
import billable from './billable/billable.service'
import leistungsblock from './leistungsblock/leistungsblock.service'
import lucinda from './lucinda/lucinda.service'
import oddb from './oddb/oddb.service'
import metaArticle from './meta-article/meta-article.service'
import briefe from './briefe/briefe.service'
import { ACE, declareACE } from '../util/acl'
import utility from './utility/utility-service'
const generateACLs = (servicename) => {
  const a = []
  const a1 = new ACE(servicename)
  const a2 = new ACE(servicename + '.create', a1)
  const a3 = new ACE(servicename + '.remove', a1)
  const a4 = new ACE(servicename + '.update', a1)
  const a5 = new ACE(servicename + '.patch', a4)
  const a6 = new ACE(servicename + '.find', a4)
  const a7 = new ACE(servicename + '.get', a6)
  declareACE([a1, a2, a3, a4, a5, a6, a7])
}
import schedule from './schedule/schedule.service'
import stickynotes from './stickynotes/stickynotes.service'
import bills from './bills/bills.service'
import invoice from './invoice/invoice.service'
import payments from './payments/payments.service'
import diagnose from './diagnose/diagnose.service'

export default (app) => {
  app.configure(elexisConfig)
  generateACLs('elexis-config')
  app.configure(admin)
  app.configure(user)
  generateACLs('user')
  app.configure(kontakt)
  generateACLs('kontakt')
  app.configure(patient)
  generateACLs('patient')
  app.configure(agntermine)
  generateACLs('termin')
  app.configure(fall)
  app.configure(konsultation)
  app.configure(article)
  app.configure(elexisUserconfig)
  app.configure(prescriptions)
  app.configure(auf)
  app.configure(createpdf)
  app.configure(macros)
  app.configure(labresults)
  app.configure(findings)
  app.configure(stickers)
  generateACLs('stickers')
  app.configure(billing)
  app.configure(tarmed)
  app.configure(billable)
  app.configure(leistungsblock)
  app.configure(lucinda)
  app.configure(oddb)
  app.configure(metaArticle)
  app.configure(briefe)
  app.configure(schedule)
  app.configure(stickynotes)
  app.configure(bills)
  app.configure(invoice)
  app.configure(payments)
  app.configure(diagnose)
  app.configure(utility)
}
