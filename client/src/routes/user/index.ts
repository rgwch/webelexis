/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { Session } from 'services/session';
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
  protected loggedInViews = [v.details, v.manageusers];
  protected loggedOutViews = [v.lostpwd];
  protected views;
  protected state: State;
  protected actView = v.details.view;

  constructor(
    private ea: EventAggregator,
    private check: checkACE,
    private router: Router,
    private session: Session
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

  protected logout(){
    this.session.logout().then(loggedOut=>{
      this.router.navigateToRoute("dispatch")
    })
  }

  protected switchTo(view) {
    this.actView=view.view
  }
}
