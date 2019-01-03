import { autoinject, useView, PLATFORM } from "aurelia-framework";
import { UserManager, UserType } from "models/user";
import {CommonViewer, ViewerConfiguration} from 'components/commonviewer'
import { EventAggregator } from "aurelia-event-aggregator";
import env from 'environment'

@autoinject
@useView(PLATFORM.moduleName('./manageuser.pug'))

export class Manageuser{
  eamessage="usermgr:selected"
  vc: ViewerConfiguration={
    dataType: 'usr',
    selectMsg: this.eamessage,
    title: 'Anwender',
    getLabel: obj=>obj.email,
    searchFields: [{
      name: "email",
      label: "Username",
      asPrefix: true
    }]
  }
  user: UserType
  roles 
  rolenames:string[]
  hasroles
  constructor(private userManager:UserManager, private ea:EventAggregator){
    this.ea.subscribe(this.eamessage,user=>{
      this.user=user 
    }) 
    this.roles=env.metadata.roles
    this.rolenames=Object.keys(this.roles)
  }
}

export class KeysValueConverter {
  toView(obj) {
    return Reflect.ownKeys(obj);
  }
}
