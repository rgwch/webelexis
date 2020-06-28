/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const elexisConfig = require('./elexis-config/elexis-config.service.js');
const admin = require('./admin/admin.service.js');
const user = require('./user/user.service.js');
const kontakt = require('./kontakt/kontakt.service.js');
const agntermine = require('./agntermine/agntermine.service.js');
const patient = require('./patient/patient.service.js');
const fall = require('./fall/fall.service.js');
const konsultation = require('./konsultation/konsultation.service.js');
const article = require('./article/article.service.js');
const elexisUserconfig = require('./elexis-userconfig/elexis-userconfig.service.js');
const prescriptions = require('./prescriptions/prescriptions.service.js');
const auf = require('./auf/auf.service.js');
const createpdf = require('./createpdf/createpdf.service.js');
const macros = require('./macros/macros.service.js');
const labresults = require('./labresults/labresults.service.js');
const findings = require('./findings/findings.service.js');
const stickers = require('./stickers/stickers.service.js');
const billing = require('./billing/billing.service.js');
const tarmed = require('./tarmed/tarmed.service.js');
const billable = require('./billable/billable.service.js');
const leistungsblock = require('./leistungsblock/leistungsblock.service.js');
const lucinda = require('./lucinda/lucinda.service.js');
const oddb = require('./oddb/oddb.service.js');
const metaArticle = require('./meta-article/meta-article.service.js');
const briefe = require('./briefe/briefe.service.js');
const {ACE,declareACE}=require('../util/acl')
const generateACLs=servicename=>{
  const a=[]
  const a1=new ACE(servicename)
  const a2=new ACE(servicename+".create",a1)
  const a3=new ACE(servicename+".remove",a1)
  const a4=new ACE(servicename+".update",a1)
  const a5=new ACE(servicename+".patch",a4)
  const a6=new ACE(servicename+".find",a4)
  const a7=new ACE(servicename+".get",a6)
  declareACE([a1,a2,a3,a4,a5,a6,a7])
}
const schedule = require('./schedule/schedule.service.js');
const stickynotes = require('./stickynotes/stickynotes.service.js');
const bills = require('./bills/bills.service.js');
module.exports = function (app) {
 app.configure(elexisConfig);
 generateACLs('elexis-config')
 app.configure(admin);
 app.configure(user);
 generateACLs('user')
 app.configure(kontakt);
 generateACLs('kontakt')
 app.configure(patient);
 generateACLs('patient')
 app.configure(agntermine);
 generateACLs('termin');
 app.configure(fall);
 app.configure(konsultation);
 app.configure(article);
 app.configure(elexisUserconfig);
 app.configure(prescriptions);
 app.configure(auf);
 app.configure(createpdf);
 app.configure(macros);
 app.configure(labresults);
 app.configure(findings);
 app.configure(stickers);
 generateACLs('stickers')
 app.configure(billing);
 app.configure(tarmed);
 app.configure(billable);
 app.configure(leistungsblock);
 app.configure(lucinda);
 app.configure(oddb);
 app.configure(metaArticle);
 app.configure(briefe);
 app.configure(schedule);
 app.configure(stickynotes);
 app.configure(bills);
};
