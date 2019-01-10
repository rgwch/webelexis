/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject } from "aurelia-framework";
import { User, UserType } from "models/user";
import { DataSource } from "services/datasource";
import { WebelexisEvents } from "webelexisevents";
import env from 'environment'

@autoinject
export class Session {
  private currentUser: User;

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    // Warning: Dirty workaround ahead
    if (env.transport === "fhir") {
      this.currentUser = new User({
        email: "admin@webelexis.ch",
        roles: ["admin", "guest", "user", "mpa"]
      })
    }
  }

  public async login(user?: string, pwd?: string, persist?: boolean) {
    const usr: UserType = await this.ds.login(user, pwd);
    if (usr) {
      usr["type"] = "usr";
      this.currentUser = new User(usr);
      this.we.selectItem(usr);
    } else {
      this.we.logout();
      this.currentUser = undefined;
    }
    return this.currentUser;
  }

  public setUser(user: UserType) {
    user.type = "usr"
    this.currentUser = new User(user)
    this.we.selectItem(user)
  }

  public async logout() {
    this.currentUser = undefined;
    this.we.logout();
    return this.ds.logout();
  }

  public async getUser() {
    if (!this.currentUser) {
      return await this.login();
    }
    return this.currentUser;
  }
}
