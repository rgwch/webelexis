/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Session } from "services/session";
import { autoinject } from "aurelia-framework";
import { DataSource } from "services/datasource";
import { Router } from "aurelia-router";
import { pluck } from "rxjs/operators";
import { connectTo } from "aurelia-store";
import { UserType } from "models/user-model";

@autoinject
@connectTo(store => store.state.pipe(pluck("user") as any))
export class Login {
  protected username: string;
  protected password: string;
  protected testmode: boolean;
  private state: UserType;

  constructor(
    private ds: DataSource,
    private session: Session,
    private router: Router
  ) {}

  public activate() {
    return this.ds.metadata().then(meta => {
      this.testmode = meta.testing;
      return this.ds.login().then(user => {
        if (user) {
          this.session.setUser(user);
          return this.router.navigateToRoute("dispatch");
        } else {
          return true;
        }
      });
    });
  }

  public doLogin() {
    this.ds.login(this.username, this.password).then(user => {
      if (user) {
        this.session.setUser(user);
        this.router.navigateToRoute("dispatch");
      } else {
        alert("Username oder Passwort falsch");
      }
    });
  }

  public loginAs(name: string, pwd: string) {
    this.ds.login(name, pwd).then(user => {
      if (user) {
        this.session.setUser(user);
        this.router.navigateToRoute("dispatch");
      } else {
        alert("Interner Fehler: Login misslungen");
      }
    });
  }

  public logout() {
    this.session.logout().then(loggedOut => {
      this.router.navigate("/");
    });
  }
}
