import { PLATFORM } from "aurelia-pal";

export default{
  login: {
    name: "Login",
    view: PLATFORM.moduleName('./userdetail')
    
  },
  lostpwd:{
    name: "Passwort vergessen",
    view: PLATFORM.moduleName('./lostpassword')
  }
}
