import {autoinject} from 'aurelia-framework'
import {Session} from '../../services/session'
import {computedFrom} from "aurelia-framework";
import {Router} from 'aurelia-router'
import {HttpWrapper} from '../../services/http-wrapper'

@autoinject()
export class Profile{
  private user={}
  private oldpwd:string=""
  private newpwd:string=""
  private repeatpwd:string=""

  constructor(private session:Session, private router:Router, private http:HttpWrapper){
    this.user=this.session.getUser()
  }

  getUsername(){
    if(this.user['emails'] instanceof Array){
      return this.user['emails'][0].value
    }else{
      return this.user['emails']
    }
  }

  chpwd(){
    this.http.post("auth/chpwd",{id: this.user['id'], oldpwd: this.oldpwd, newpwd:this.newpwd}).then(result=>{
      if(result && result.status == 'ok'){
        alert("ok")
      }else{
        alert(result.message)
      }
    })
  }

  @computedFrom('oldpwd','newpwd','repeatpwd')
  get canChangePwd():boolean{
    let result=this.oldpwd.length>0
      && this.newpwd.length>0
      && this.newpwd === this.repeatpwd
    return result
  }

  @computedFrom('newpwd','repeatpwd')
  get pwdDifferent():boolean{
    return this.newpwd != this.repeatpwd
  }

  logout(){
    let sid=this.session.logout()
    this.http.get("auth/logout").then(result=>{
      console.log(result)
    })
    this.router.navigate("/")
  }
}
