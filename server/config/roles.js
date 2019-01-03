/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 define user roles and (possibly localized) labels for these roles
*/


module.exports = {
  guest: "Gast",          // a person not known to the system
  patient: "Patient",     // Someone who can see their own data
  user: "Anwender",       // a person known to the system
  privacy: "privacy",     // a person bound to patient privacy
  mpa: "Mpa",             // assistant of the practioner
  agenda: "Agenda",       // can see agenda
  billing: "Abrechnung",  // person who can create billings
  doc: "Arzt",            // doctor
  admin: "admin"          // Administrator
}
