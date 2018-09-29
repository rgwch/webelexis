import { WebelexisEvents } from './../../webelexisevents';
import { User } from './../../models/user';
import { DataSource,DataService } from '../../services/datasource';
import { autoinject } from 'aurelia-framework';

@autoinject
export class UserDetail{
  name: "Itze"
  style="position:absolute;left:395px;right:15px;top:20px;"
  userService:DataService


  constructor(private ds:DataSource,private we:WebelexisEvents){
    this.userService=ds.getService('usr')
  }

  login(){
    this.ds.authenticate("hans","fritz").then(usr=>{
      const user=new User(usr)
      this.we.selectItem(usr)
    }).catch(err=>{
      alert("could not login")
    })
  }
}
