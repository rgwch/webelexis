import { autoinject, useView, PLATFORM } from "aurelia-framework";
import { UserManager, UserType } from "models/user";
import {CommonViewer, ViewerConfiguration} from 'components/commonviewer'
import { EventAggregator } from "aurelia-event-aggregator";

@autoinject
@useView(PLATFORM.moduleName('./manageuser.pug'))

export class Manageuser{
  vc: ViewerConfiguration={
    dataType: 'usr',
    selectMsg: "usermgr:selected",
    title: 'Anwender',
    getLabel: obj=>obj.email,
    searchFields: [{
      name: "email",
      label: "Username",
      asPrefix: true
    }]
  }
  user: UserType
  constructor(private userManager:UserManager, private ea:EventAggregator){
    this.ea.subscribe("usrmgr:selected",user=>{
      this.user=user 
    }) 
  }
}
