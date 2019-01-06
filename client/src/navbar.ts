import { autoinject } from "aurelia-framework";
import { WebelexisEvents } from "./webelexisevents";

@autoinject
export class Navbar {
  public loggedIn: boolean;

  constructor(private ev: WebelexisEvents) {}
  public logout() {
    this.ev.logout();
  }

  public stateChanged(now, before) {
    this.loggedIn = now != undefined;
  }
  public attached() {}
}
