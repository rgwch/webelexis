import { PLATFORM } from "aurelia-pal";

export default{
  login: {
    name: "Login",
    view: PLATFORM.moduleName('./login')
    
  },
  lostpwd:{
    name: "Passwort vergessen",
    view: PLATFORM.moduleName('./lostpassword')
  }
}
