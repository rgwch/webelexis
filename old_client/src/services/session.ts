/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject } from "aurelia-framework";
import { UserType } from "models/user-model";
import { DataSource } from "services/datasource";
import { WebelexisEvents } from "webelexisevents";
import env from 'environment'

@autoinject
export class Session {
  private currentUser: UserType;

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    // Warning: Dirty workaround ahead
    /* if (env.transport === "fhir") {
       this.currentUser = new User({
         email: "admin@webelexis.ch",
         roles: ["admin", "guest", "user", "mpa"]
       })
      } */
  }

  public async login(username?: string, pwd?: string, persist?: boolean) {
    const user: UserType = await this.ds.login(username, pwd);
    if (user) {
      user["type"] = "user";
      this.we.selectItem(user);
      this.currentUser = user;
    } else {
      this.we.logout();
      this.currentUser = undefined;
    }
    return this.currentUser;
  }

  public setUser(user: UserType) {
    user.type = "user"
    this.currentUser = user
    this.we.selectItem(user)
  }

  public async logout() {
    this.currentUser = undefined;
    this.we.logout();
    return this.ds.logout();
  }

  public async getUser(): Promise<UserType> {
    if (!this.currentUser) {
      return await this.login();
    }
    return this.currentUser;
  }
}
