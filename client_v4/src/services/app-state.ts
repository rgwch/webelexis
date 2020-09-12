import { IElexisType } from '../models/elexistype';
import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from './dataservice';
import { autoinject } from 'aurelia-framework';

import { IUser } from '../models/user-manager';

export const SELECTABLE = {
  user: "user",
  patient: "patient",
  mandator: "mandant",
  case: "fall",
  encounter: "enc"
}

@autoinject
export class AppState {
  loggedInUser: IUser = null
  ds: IDataSource
  subscriptions = new Array<(IUser) => {}>()

  items = {}

  constructor() {
    this.ds = Container.instance.get("DataSource")

  }

  selectItem(type: string, object: IElexisType) {
    if (object) {
      this.items[type] = object
    } else {
      delete this.items[type]
    }
  }

  getSelectedItem(type: string) {
    return this.items[type]
  }

  isLoggedIn() {
    return !!this.loggedInUser
  }

  subscribe(func: (newUser) => any) {
    this.subscriptions.push(func)
  }
  hasRole(role: string): boolean {
    if (this.loggedInUser) {
      if (this.loggedInUser.roles.includes(role)) {
        return true
      }
    }
    return false
  }
  login = (username?: string, password?: string): Promise<IUser> => {
    return this.ds.login(username, password).then((user: IUser) => {
      this.loggedInUser = user
      this.selectItem('user', user)
      this.subscriptions.forEach(sub => sub(user))
      return user
    }).catch(err => {
      console.log(err)
      this.loggedInUser = null
      this.selectItem("user", null)
      return null
    })

  }


  logOut() {
    this.ds.logout()
    this.loggedInUser = null
    this.selectItem('user', null)
  }
}
