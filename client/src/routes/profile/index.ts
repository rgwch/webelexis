import {autoinject} from 'aurelia-framework'
import {Session} from '../../services/session'
import {computedFrom} from "aurelia-framework";
import {Router} from 'aurelia-router'

@autoinject()
export class Profile{
  private user={}
  private oldpwd:string=""
  private newpwd:string=""
  private repeatpwd:string=""

  constructor(private session:Session, private router:Router){
    this.user=this.session.getUser()
  }

  getUsername(){
    if(this.user['emails'] instanceof Array){
      return this.user['emails'][0].value
    }else{
      return this.user['emails']
    }
  }

  @computedFrom('oldpwd','newpwd','repeatpwd')
  get canChangePwd():boolean{
    let result=this.oldpwd.length>0
      && this.newpwd.length>0
      && this.newpwd === this.repeatpwd
    return result
  }

  logout(){
    this.session.logout()
    this.router.navigate("/")
  }
}