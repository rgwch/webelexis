/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, noView, LogManager } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Session } from "services/session";
import { FhirService } from "./fhirservice";
const log = LogManager.getLogger("OAuth login step 2")
/**
 * After successful OAuth authentication, thie OAuth Server calls (by configuration) this
 * route. Wenn activatet, get the details of the current user and create a session with that
 * user. After that, we can navigate to the normal start of the WebApp ("dispatch").
 */
@autoinject
@noView
export class Ready {
  constructor(
    private fhir: FhirService,
    private router: Router,
    private session: Session
  ) { }

  public async activate() {
    try {
      log.info("Got response from OAuth")
      const result = await this.fhir.getSmartclient();
      log.info("Loaded Smart client")
      sessionStorage.setItem("ch.webelexis.logintoken", result);
      alert("we are logged in!");
      this.session.setUser({
        email: "admin@webelexis.ch",
        roles: ["admin", "guest", "user", "mpa"]
      });
      this.router.navigateToRoute("dispatch");
    } catch (err) {
      log.error("Smartclient failed: %s", err)
      alert("SmartClient failed " + err);
    }
  }
}
