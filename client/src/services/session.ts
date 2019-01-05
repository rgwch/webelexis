import { WebelexisEvents } from 'webelexisevents';
import { DataSource } from 'services/datasource';
import { autoinject } from 'aurelia-framework';
import { User, UserType } from "models/user";
import { DataService } from './datasource';

@autoinject
export class Session {
  private currentUser: User

  constructor(private ds: DataSource, private we: WebelexisEvents) {

  }

  async login(user?: string, pwd?: string, persist?: boolean) {
    const usr: UserType = await this.ds.login(user, pwd)
    if (usr) {
      this.currentUser = new User(usr)
      usr["type"] = "usr"
      this.we.selectItem(usr)
    } else {
      this.we.logout()
      this.currentUser = undefined
    }
    return this.currentUser
  }

  async logout() {
    this.currentUser = undefined;
    this.we.logout()
    return this.ds.logout()
  }

  async getUser() {
    if (!this.currentUser) {
      return await this.login()
    }
    return this.currentUser
  }
}
