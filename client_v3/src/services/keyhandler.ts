import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

export type EventBinding={
  event: string,
  handler: (ev)=>any
}
@autoinject
export class Keyhandler{
  subscriptions=new Map()

  constructor(private ea:EventAggregator){}

  subscribe(name,...handlers:Array<EventBinding>){
    const eas=[]
    handlers.forEach(handler=>{
      eas.push(this.ea.subscribe(handler.event,handler.handler))
    })
    this.subscriptions[name]=eas
  }

  unsubscribe(name){
    const eas=this.subscriptions[name]
    if(eas){
      eas.forEach(ea=>{
        ea.unsubscribe()
      })
    }
  }
}
