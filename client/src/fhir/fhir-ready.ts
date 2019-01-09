import { FhirService } from './fhirservice';
/************************************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2018 by G. Weirich
 * 
 * Webelexis is licensed under the terms of the included
 * LICENSE file.
 *************************************************************/
import { autoinject, noView } from 'aurelia-framework'
import { Router } from 'aurelia-router';
import { Session } from 'services/session';

@autoinject
@noView
export class Ready {
  private loggedin = "no";

  constructor(private fhir: FhirService, private router:Router, private session:Session) { 
    console.log("auth/ready constructed")
  }

  async activate(){
    try {
      let result = await this.fhir.getSmartclient();
      sessionStorage.setItem("ch.webelexis.logintoken",result)
      alert("we are logged in!")
      this.session.setUser({
        email: "admin@webelexis.ch",
        roles: ["admin","guest","user","mpa"]
      })
      this.router.navigateToRoute("dispatch")
    } catch (err) {
      alert("SmartClient failed "+err)

    }
  }
}
