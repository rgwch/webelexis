import v from './views'
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { checkACE } from '../../services/checkrole'

@autoinject
export class TestIndex {
  views = [v.login, v.lostpwd, v.createuser]
  display={}

  constructor(private ea: EventAggregator, private check: checkACE) {

  }

  async doShow(view) {
    if (view.acl) {
      const dis = await this.check.toView(view.acl)
      return dis
    } else {
      return true;
    }
  }

  attached() {
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
