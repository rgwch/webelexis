import { State } from 'state';
import v from './views'
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { checkACE } from '../../services/checkrole'
import { Router } from 'aurelia-router';
import { WebelexisEvents } from 'webelexisevents';
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

@autoinject
@connectTo(store => store.state.pipe(<any>pluck("usr")))

export class TestIndex {
  loggedInViews=[v.logout, v.details,v.manageusers]
  loggedOutViews=[v.login, v.lostpwd]
  views
  state

  display={}

  constructor(private ea: EventAggregator, private check: checkACE, private router:Router){

  }

  home(){
    this.router.navigateToRoute("dispatch")
  }
 
  attached() {
    this.views=this.state ? this.loggedInViews : this.loggedOutViews
    for(const vi of this.views){
      vi['show']=true
      if(vi["acl"]){
        this.check.toView(vi["acl"]).then(result=>{
          if(!result){
            vi['show']=false
          }
        })
      }
    }
  }

  switchTo(view) {
    this.ea.publish("testdetail", view)
  }
}
