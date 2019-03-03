/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 define user roles and (possibly localized) labels for these roles
*/


module.exports = {
  guest: {
    id: "guest",
    label: "Gast",
    descr: "a person not known to the system"
  },
  Patient: {
    id: "patient",
    label: "Patient",
    descr: "Someone who can see their own data only"
  },
  user: {
    id: "user",
    label: "Anwender",
    descr: "a person known to the system"
  },
  privacy: {
    id: "priv",
    label: "Geheimnisträger",
    descr: "a person bound by a privacy agreement or privacy law"
  },
  mpa: {
    id: "assistant",
    label: "MPA",
    descr: "a person working with the practice"
  },
  agenda: {
    id: "appnt",
    label: "Agenda",
    descr: "someone who may manage appointments"
  },
  billing: {
    id: "billing",
    label: "Abrechnung",
    descr: "someone who may see and handle billings"
  },
  doc: {
    id: "doctor",
    label: "Arzt",
    descr: "A doctor"
  },
  executive:{
    id: "executive_doctor",
    Label: "Leitender Arzt",
    desc: "A doctor with administrative functions"
  },
  admin: {
    id: "admin",
    label: "Administrator",
    descr: "An administrator"
  }
}
