import { PLATFORM } from 'aurelia-framework';

export default {
  details: {
    name: "Anwenderdaten",
    view: PLATFORM.moduleName('./userdetails')
  },
  lostpwd: {
    name: "Passwort vergessen",
    view: PLATFORM.moduleName('./lostpassword')
  },
  manageusers: {
    acl: "usr.update",
    name: "Anwender verwalten",
    view: PLATFORM.moduleName('./manageuser')
  }
}
