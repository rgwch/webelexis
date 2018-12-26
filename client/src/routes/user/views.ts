import { PLATFORM } from "aurelia-pal";

export default{
  login: {
    name: "Login",
    view: PLATFORM.moduleName('./login')
  },
  logout: {
    name: "Logout",
    view: PLATFORM.moduleName('./login')  
  },
  details:{
    name: "Anwenderdaten",
    view: PLATFORM.moduleName('./userdetails')
  },
  lostpwd:{
    name: "Passwort vergessen",
    view: PLATFORM.moduleName('./lostpassword')
  },
  manageusers:{
    name: "Anwender verwalten",
    view: PLATFORM.moduleName('./manageuser'),
    acl: "usr.update"
  }

}
