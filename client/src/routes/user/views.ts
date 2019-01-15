import { PLATFORM } from "aurelia-pal";

export default {
  details: {
    name: "Anwenderdaten",
    view: PLATFORM.moduleName('./userdetails')
  },
  login: {
    name: "Login",
    view: PLATFORM.moduleName('./login')
  },
  logout: {
    name: "Logout",
    view: PLATFORM.moduleName('./login')
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
