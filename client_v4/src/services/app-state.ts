import { IElexisType } from 'models/elexistype';
import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from './dataservice';
import { autoinject } from 'aurelia-framework';

import { IUser } from '../models/user-manager';

export const SELECTABLE = {
  user: "user",         // The currently logged-in user
  patient: "patient",   // the currently selected patient
  mandator: "mandant",  // the currently responsible mandator (depending on case)
  case: "fall",         // the currently active case
  encounter: "enc",     // the currently active encounter
  resource: "rsc"       // the currently selected scheduler resource
}

@autoinject
export class AppState {
  loggedInUser: IUser = null
  ds: IDataSource
  subscriptions = new Array<{ elemtype, func: (string, IElexisType) => {} }>()

  items = {}

  constructor() {
    this.ds = Container.instance.get("DataSource")

  }

  selectItem(type: string, object: IElexisType) {
    if (object) {
      this.items[type] = object
      this.subscriptions.forEach(sub => {
        if (sub.elemtype == type) {
          sub.func(type, object)
        }
      })
    } else {
      delete this.items[type]
      this.subscriptions.forEach(sub => {
        if (sub.elemtype == type) {
          sub.func(type, null)
        }
      })

    }
  }

  getSelectedItem(type: string) {
    return this.items[type]
  }

  isLoggedIn() {
    return !!this.loggedInUser
  }

  subscribe(elemtype: string | Array<string>, func: (type, item) => any) {
    if (Array.isArray(elemtype)) {
      elemtype.forEach(typ => this.subscribe(typ, func))
    } else {
      this.subscriptions.push({ elemtype, func })
    }
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
      this.selectItem(SELECTABLE.user, user)
      return user
    }).catch(err => {
      console.log(err)
      this.loggedInUser = null
      this.selectItem(SELECTABLE.user, null)
      return null
    })

  }


  logOut() {
    this.ds.logout()
    this.loggedInUser = null
    this.selectItem('user', null)
  }
}
