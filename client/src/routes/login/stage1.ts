import { Session } from 'services/session';
import { autoinject } from "aurelia-framework";
import { DataSource } from "services/datasource";
import { Router } from 'aurelia-router';

@autoinject
export class Login {
  protected username
  protected password

  constructor(private ds: DataSource,
    private session: Session,
    private router: Router) {

  }
  activate() {
    return this.ds.login().then(user => {
      if (user) {
        this.session.setUser(user)
        this.router.navigateToRoute("dispatch")
        return true
      }else{
        return true
      } 
    })
  }

  doLogin(){
    this.ds.login(this.username,this.password).then(user=>{
      if(user){
        this.session.setUser(user)
        this.router.navigateToRoute("dispatch")
      }else{
        alert("Username oder Passwort falsch")
      }
    })
  }
}
