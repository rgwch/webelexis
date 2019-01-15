import { UserType } from 'models/user';
import { WebelexisEvents } from "webelexisevents";
import { autoinject, useView, PLATFORM } from "aurelia-framework";

@autoinject
@useView(PLATFORM.moduleName('./userdetails.pug'))
export class Userdetails {
  protected user: UserType
/*
  constructor(private we: WebelexisEvents) {
    this.user = this.we.getSelectedItem('usr')
  }
  */
}
