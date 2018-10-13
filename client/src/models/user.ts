/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { ElexisType } from './elexistype';
import { autoinject, computedFrom } from "aurelia-framework";

/**
 * A Webelexis User (which is deliberately not an Elexis-User, but can be linked
 * to an Elexis-User and/or an Elexis-Kontakt)
 * A Webelexis user has an email (which has to be unique) and a set of roles. All other
 * properties are optional.
 */
export interface UserType extends ElexisType{
  email:string
  label?: string
  realname?: string
  elexis_id?: string
  elexisuser_id?: string
  elexiskontakt?:any
  roles: Array<string>
}

@autoinject
export class User{
  obj: UserType

  @computedFrom('obj')
  get label(){
    return this.obj.label
  }

  @computedFrom('obj')
  get email(){
    return this.obj.email
  }
  constructor(data:UserType){
    this.obj=data
  }


}
