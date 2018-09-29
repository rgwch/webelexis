import { ElexisType } from './../../models/elexistype';
import { WebelexisEvents } from './../../webelexisevents';
import { User, UserType } from './../../models/user';
import { DataSource,DataService } from '../../services/datasource';
import { autoinject } from 'aurelia-framework';
import {connectTo} from 'aurelia-store'
import { pluck } from 'rxjs/operators'


@autoinject
@connectTo(store=>store.state.pipe(pluck("usr")))
export class UserDetail{
  name: "Itze"
  style="position:absolute;left:395px;right:15px;top:20px;"
  userService:DataService
  actUser=""

  constructor(private ds:DataSource,private we:WebelexisEvents){
    this.userService=ds.getService('usr')
  }

  login(email,pwd){
    this.ds.authenticate(email,pwd).then((usr:UserType)=>{
      const user=new User(usr)
      usr["type"]="usr"
      this.we.selectItem(usr)
      this.actUser=usr.email
    }).catch(err=>{
      alert("could not login")
    })
  }
}
