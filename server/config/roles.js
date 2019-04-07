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
  external:{
    id: "user_external",
    label: "externer Anwender",
    descr: "A user who can access remotely"
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
  doc: {
    id: "doctor",
    label: "Arzt",
    descr: "A doctor"
  },
  executive:{
    id: "executive_doctor",
    label: "Leitender Arzt",
    desc: "A doctor with administrative functions"
  },
  admin: {
    id: "admin",
    label: "Administrator",
    descr: "An administrator"
  }
}
