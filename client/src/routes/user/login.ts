import { ElexisType } from './../../models/elexistype';
import { WebelexisEvents } from './../../webelexisevents';
import { User, UserType } from './../../models/user';
import { DataSource, DataService } from '../../services/datasource';
import { autoinject } from 'aurelia-framework';
import { connectTo } from 'aurelia-store'
import { pluck } from 'rxjs/operators'
import { Router } from 'aurelia-router';
import env from '../../environment'


@autoinject
@connectTo(store => store.state.pipe(<any>pluck("usr")))
export class UserDetail {
  //style = "position:absolute;left:395px;right:15px;top:20px;"
  userService: DataService
  demomode = false
  password: string
  username: string

  constructor(private ds: DataSource, private we: WebelexisEvents, private router: Router) {
    this.userService = ds.getService('usr')
  }

  attached() {
    this.demomode = env.metadata["testing"]
  }
  login(email?, pwd?) {
    if (!email) {
      email = this.username
      pwd = this.password
    }
    this.ds.login(email, pwd).then((usr: UserType) => {
      const user = new User(usr)
      usr["type"] = "usr"
      this.we.selectItem(usr)
      this.router.navigateToRoute("dispatch")
    }).catch(err => {
      alert("E-Mail oder Passwort falsch")
    })
  }

  logout() {
    this.ds.logout().then(() => {
      this.we.logout()
      this.router.navigateToRoute("dispatch")
    })
  }
}
