import { State } from "state";
import v from "./views";
import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { checkACE } from "../../services/checkrole";
import { Router } from "aurelia-router";
import { WebelexisEvents } from "webelexisevents";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";

@autoinject
@connectTo(store => store.state.pipe( pluck("usr") as any))
export class TestIndex {
  protected loggedInViews = [v.logout, v.details, v.manageusers];
  protected loggedOutViews = [v.login, v.lostpwd];
  protected views;
  protected state: State;
  protected actView = v.details.view;

  private display = {};

  constructor(
    private ea: EventAggregator,
    private check: checkACE,
    private router: Router
  ) {}

  public attached() {
    this.views = this.state ? this.loggedInViews : this.loggedOutViews;
    for (const vi of this.views) {
      vi["show"] = true;
      if (vi["acl"]) {
        this.check.toView(vi["acl"]).then(result => {
          if (!result) {
            vi["show"] = false;
          }
        });
      }
    }
    this.actView = v.details.view
  }

  protected home() {
    this.router.navigateToRoute("dispatch");
  }

  protected switchTo(view) {
    this.ea.publish("testdetail", view);
  }
}
