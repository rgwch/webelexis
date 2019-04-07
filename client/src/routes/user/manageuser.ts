/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, useView, PLATFORM } from "aurelia-framework";
import { UserManager, UserType } from "models/user-model";
import { CommonViewer, ViewerConfiguration } from 'components/commonviewer'
import { EventAggregator } from "aurelia-event-aggregator";
import env from 'environment'
import { FlexformConfig } from "components/flexform";
import { KontaktType } from "models/kontakt";

@autoinject
@useView(PLATFORM.moduleName('./manageuser.pug'))

export class Manageuser {
  protected user: UserType
  protected person: KontaktType
  protected allRoles
  protected hasrole = {}

  private eamessage = "usermgr:selected"
  
  private ffs: FlexformConfig = {
    attributes: [
      {
        attribute: "email",
        label: "E-Mail"
      },
      {
        attribute: "password",
        label: "Initialpasswort"
      }
    ],
    title: () => "User"
  }
  
  private vc: ViewerConfiguration = {
    //createDef: this.ffs,
    dataType: 'user',
    getLabel: obj => obj.id,
    searchFields: [{
      asPrefix: true,
      label: "Username",
      name: "id"
    }],
    selectMsg: this.eamessage,
    title: '',
  }

  constructor(private userManager: UserManager, private ea: EventAggregator) {
    this.ea.subscribe(this.eamessage, user => {
      this.user = user
      this.hasrole = {}
      if (this.user && this.user.roles) {
        for (const role of this.user.roles) {
          this.hasrole[role] = true
        }
        this.userManager.getElexisKontakt(this.user).then(k=>{
          this.person=k
        }).catch(err=>{
          this.person={
            id:"0",
            bezeichnung1:"unbekannt",
            bezeichnung2:"unbekannt"
          }
        })
      }
    })
    this.allRoles = env.metadata.roles
  }
  public label(role) {
    return this.allRoles[role].label
  }
  public accept() {
    const roles = []
    for (const role of Object.keys(this.hasrole)) {
      if (this.hasrole[role] === true) {
        roles.push(role)
      }
    }
    this.user.roles = roles
    this.userManager.save(this.user).then(saved => {
      alert("ok")
    }).catch(err => {
      // console.log(err)
      alert("error when saving " + this.user.id)
    })
  }
}
export class KeysValueConverter {
  public toView(obj) {
    return Reflect.ownKeys(obj);
  }
}
