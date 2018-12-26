import { PLATFORM } from "aurelia-pal";

export default{
  login: {
    name: "Login",
    view: PLATFORM.moduleName('./login'),
    acl: "true"    
  },
  lostpwd:{
    name: "Passwort vergessen",
    view: PLATFORM.moduleName('./lostpassword'),
    acl: "true"
  },
  createuser:{
    name: "Anwender erstellen",
    view: PLATFORM.moduleName('./manageuser'),
    acl: "'User' | can: read"
  }

}
