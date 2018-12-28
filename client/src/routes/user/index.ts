import v from './views'
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { checkACE } from '../../services/checkrole'
import { Router } from 'aurelia-router';
import { WebelexisEvents } from '../../../test/spec/dummyevents';

@autoinject
export class TestIndex {
  loggedInViews=[v.logout, v.details,v.manageusers]
  loggedOutViews=[v.login, v.lostpwd]
  views

  display={}

  constructor(private ea: EventAggregator, private check: checkACE, private router:Router,
    private we:WebelexisEvents) {

  }

  home(){
    this.router.navigateToRoute("dispatch")
  }
  /*
  async doShow(view) {
    if (view.acl) {
      const dis = await this.check.toView(view.acl)
      return dis
    } else {
      return true;
    }
  }
*/
  attached() {
    const user=this.we.getSelectedItem('usr')
    this.views=user ? this.loggedInViews : this.loggedOutViews
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