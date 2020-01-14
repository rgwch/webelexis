/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { UserManager, UserType } from './../../models/user-model';
import { WebelexisEvents } from "webelexisevents";
import { autoinject, useView, PLATFORM } from "aurelia-framework";
import { KontaktType, Kontakt } from 'models/kontakt';

@autoinject
@useView(PLATFORM.moduleName('./userdetails.pug'))
export class Userdetails {
  protected user: UserType
  protected mandant: KontaktType
  protected lbl="ja"

  constructor(private we: WebelexisEvents, private um: UserManager) {
    this.user = this.we.getSelectedItem('user')
    this.mandant=this.user._Mandator
  }

  get label(){
    return Kontakt.getLabel(this.mandant)
  }

  protected update() {
    this.um.save(this.user)
  }
}
