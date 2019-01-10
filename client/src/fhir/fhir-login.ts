/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogService } from "aurelia-dialog";
import { inlineView } from "aurelia-framework";
import env from "environment";
import { Session } from "services/session";
import { FhirService } from "./fhirservice";
import { SelectServer } from "./select-server";

@inlineView(`<template>
<button click.delegate="login()">Fhir Login</button>
</template>`)
export class FhirLogin {
  constructor(private fhir: FhirService, private dialog: DialogService) {}

  /**
   * check if we have the correct server adress (We think it's correct if it answers correctly to a
   * FHIR /metadata request). If the address does not lead to a working FHIR server, we show a dialog
   * and ask the user to enter the correct address.
   */
  public login() {
    // console.log("login");
    this.checkServer(env.fhir.server_url).then(valid => {
      if (valid) {
        this.fhir.init(env.fhir.server_url);
      } else {
        this.dialog
          .open({
            viewModel: SelectServer,
            model: { url: env.fhir ? env.fhir.server_url || "" : "" }
          })
          .whenClosed(async response => {
            if (response.wasCancelled) {
              alert("Keine Server Verbindung");
              delete env.fhir.server_url;
              return;
            } else {
              env.fhir.server_url = response.output;
              this.login();
            }
          });
      }
    });
  }

  private async checkServer(serverUrl): Promise<boolean> {
    if (!serverUrl || !/^https?:\/\/.+/.test(serverUrl)) {
      return false;
    }
    try {
      const metadata = await this.fhir.metadata(serverUrl);
      if (metadata) {
        env.fhir.metadata = metadata;
        return true;
      }
    } catch (err) {
      return false;
    }
  }
}
