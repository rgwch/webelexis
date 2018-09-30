/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const elexisConfig = require('./elexis-config/elexis-config.service.js');
const admin = require('./admin/admin.service.js');
const users = require('./users/users.service.js');
const kontakt = require('./kontakt/kontakt.service.js');
const agntermine = require('./agntermine/agntermine.service.js');
const usr = require('./usr/usr.service.js');
const patient = require('./patient/patient.service.js');
const fall = require('./fall/fall.service.js');
const konsultation = require('./konsultation/konsultation.service.js');
const article = require('./article/article.service.js');
const elexisUserconfig = require('./elexis-userconfig/elexis-userconfig.service.js');
const prescriptions = require('./prescriptions/prescriptions.service.js');
const auf = require('./auf/auf.service.js');
const createpdf = require('./createpdf/createpdf.service.js');
const documents = require('./documents/documents.service.js');
const macros = require('./macros/macros.service.js');
const labresults = require('./labresults/labresults.service.js');
module.exports = function (app) {
 app.configure(elexisConfig);
 app.configure(admin);
 app.configure(users);
 app.configure(kontakt);
 app.configure(agntermine);
 app.configure(usr);
 app.configure(patient);
 app.configure(fall);
 app.configure(konsultation);
 app.configure(article);
 app.configure(elexisUserconfig);
 app.configure(prescriptions);
 app.configure(auf);
 app.configure(createpdf);
 app.configure(documents);
 app.configure(macros);
 app.configure(labresults);
};
