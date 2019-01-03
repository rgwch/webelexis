import { autoinject, useView, PLATFORM } from "aurelia-framework";
import { UserManager, UserType } from "models/user";
import { CommonViewer, ViewerConfiguration } from 'components/commonviewer'
import { EventAggregator } from "aurelia-event-aggregator";
import env from 'environment'
import { FlexformConfig } from "components/flexform";
import { forOfStatement } from "babel-types";

@autoinject
@useView(PLATFORM.moduleName('./manageuser.pug'))

export class Manageuser {
  eamessage = "usermgr:selected"
  ffs: FlexformConfig={
    title: ()=>"User",
    attributes: [
      {
        attribute: "email",
        label: "E-Mail"
      }
    ]
  }
  vc: ViewerConfiguration = {
    dataType: 'usr',
    selectMsg: this.eamessage,
    title: 'Anwender',
    getLabel: obj => obj.email,
    createDef: this.ffs,
    searchFields: [{
      name: "email",
      label: "Username",
      asPrefix: true
    }]
  }
  user: UserType
  allRoles
  hasrole={}
  constructor(private userManager: UserManager, private ea: EventAggregator) {
    this.ea.subscribe(this.eamessage, user => {
      this.user = user
      if (this.user && this.user.roles) {
        for (const role of this.user.roles) {
          this.hasrole[role] = true
        }
      }
    })
    this.allRoles = env.metadata.roles
  }
  accept(){
    const roles=[]
    for(const role of Object.keys(this.hasrole)){
      if(this.hasrole[role]==true){
        roles.push(role)
      }
    }
    this.user.roles=roles
    this.userManager.save(this.user).then(saved=>{
      alert("ok")
    }).catch(err=>{
      console.log(err)
      alert("error when saving "+this.user.email)
    })
  }
}
export class KeysValueConverter {
  toView(obj) {
    return Reflect.ownKeys(obj);
  }
}
