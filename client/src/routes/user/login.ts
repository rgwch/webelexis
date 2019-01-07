import { autoinject, LogManager } from "aurelia-framework";
import { Router } from "aurelia-router";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";
import { Session } from "services/session";
import env from "../../environment";
import { DataService, DataSource } from "../../services/datasource";
import { User, UserType } from "./../../models/user";
import { WebelexisEvents } from "./../../webelexisevents";

@autoinject
@connectTo(store => store.state.pipe( pluck("usr") as any))
export class UserDetail {
  protected demomode = false;
  protected password: string;
  protected username: string;

  private logger = LogManager.getLogger("login");
  private userService: DataService;

  constructor(
    private ds: DataSource,
    private router: Router,
    private session: Session
  ) {
    this.userService = ds.getService("usr");
  }

  public attached() {
    console.log(JSON.stringify(env))
    this.demomode = env.metadata["testing"];
  }
  protected login(email?, pwd?) {
    if (!email) {
      email = this.username;
      pwd = this.password;
    }
    this.session.login(email, pwd).then((usr: UserType) => {
      if (usr) {
        this.router.navigateToRoute("dispatch");
      } else {
        alert("E-Mail oder Passwort falsch");
      }
    });
  }

  protected logout() {
    this.session.logout().then(() => {
      this.router.navigateToRoute("user/login");
    });
  }
}
