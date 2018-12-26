import { UserManager } from './../models/user';
import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { valueConverter } from "aurelia-binding";


@valueConverter('checkrole')
@autoinject
export class Checkrole {

  constructor(private we: WebelexisEvents, private um: UserManager) { }

  toView(role) {
    const currentUser = this.we.getSelectedItem('usr')
    return this.um.hasRole(currentUser, role)
  }
}

@valueConverter('can')
@autoinject
export class checkACE {
  constructor(private we: WebelexisEvents, private um: UserManager) { }

  async toView(acename) {
    const currentUser = this.we.getSelectedItem('usr')
    const result=await this.um.hasACE(currentUser, acename)
    return result
  }
}
