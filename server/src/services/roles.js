/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 define user roles and (possibly localized) labels for these roles
*/


module.exports = {
  guest: "guest",        // a person not known to the system
  user: "user",         // a person kknown to the system
  privacy: "privacy",   // a person bound to patient privacy
  mpa: "mpa",           // assistant of the practinioner
  agenda: "agenda",     // can see agenda
  billing: "billing",   // person who can create billings
  doc: "doc",            // doctor
  admin: "admin"         // Administrator
}
