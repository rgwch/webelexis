import { Session } from 'services/session';
import { ElexisType } from './../../models/elexistype';
import { WebelexisEvents } from './../../webelexisevents';
import { User, UserType } from './../../models/user';
import { DataSource, DataService } from '../../services/datasource';
import { autoinject, LogManager } from 'aurelia-framework';
import { connectTo } from 'aurelia-store'
import { pluck } from 'rxjs/operators'
import { Router } from 'aurelia-router';
import env from '../../environment'


@autoinject
@connectTo(store => store.state.pipe(<any>pluck("usr")))
export class UserDetail {
  logger = LogManager.getLogger("login")
  userService: DataService
  demomode = false
  password: string
  username: string

  constructor(private ds: DataSource, private router: Router, private session: Session) {
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
    this.session.login(email, pwd).then((usr: UserType) => {
      if (usr) {
        this.router.navigateToRoute("dispatch")
      } else {
        alert("E-Mail oder Passwort falsch")
      }
    })
  }

  logout() {
    this.session.logout().then(() => {
      this.router.navigateToRoute("user/login")
    })
  }
}
