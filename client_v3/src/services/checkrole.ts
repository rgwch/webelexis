/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { UserManager, UserType } from '../models/user-model';
import { WebelexisEvents } from '../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { valueConverter } from "aurelia-binding";


@valueConverter('checkrole')
@autoinject
export class Checkrole {

  constructor(private we: WebelexisEvents, private um: UserManager) { }

  toView(role) {
    const currentUser: UserType = this.we.getSelectedItem('user')
    return this.um.hasRole(currentUser, role)
  }
}

@valueConverter('can')
@autoinject
export class checkACE {
  constructor(private we: WebelexisEvents, private um: UserManager) { }

  async toView(acename) {
    const currentUser: UserType = this.we.getSelectedItem('user')
    const result = await this.um.hasACE(currentUser, acename)
    return result
  }
}
