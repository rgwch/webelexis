/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { UserManager } from './../../models/user';
import { UserType } from 'models/user';
import { WebelexisEvents } from "webelexisevents";
import { autoinject, useView, PLATFORM } from "aurelia-framework";

@autoinject
@useView(PLATFORM.moduleName('./userdetails.pug'))
export class Userdetails {
  protected user: UserType

  constructor(private we: WebelexisEvents, private um: UserManager) {
    this.user = this.we.getSelectedItem('usr')
  }

  protected update() {
    this.um.save(this.user)
  }
}
