import { Session } from 'services/session';
import { SelectServer } from './select-server';
import { DialogService } from 'aurelia-dialog';
import { FhirService } from './fhirservice';
import { inlineView } from "aurelia-framework";
import env from 'environment'

@inlineView(`<template>
<button click.delegate="login()">Login</button>
</template>`)
export class FhirLogin{

  constructor(private fhir: FhirService, private dialog: DialogService) { }

  login() {
    console.log("login");
    this.checkServer(env.fhir.server_url).then(valid => {
      if (valid) {
        this.fhir.init(env.fhir.server_url)
      } else {
        this.dialog.open({ viewModel: SelectServer, model: { url: env.fhir ? env.fhir.server_url || "" : ""} })
        .whenClosed(async response => {
          if (response.wasCancelled) {
            alert("Keine Server Verbindung")
            delete env.fhir.server_url
            return;
          } else {
            env.fhir.server_url=response.output
            this.login();
          }
        })
      }
    })

  }

  async checkServer(server_url): Promise<boolean> {
    
    if (!server_url || !/^https?:\/\/.+/.test(server_url)) {
      return false;
    }
    try {
      let metadata = await this.fhir.metadata(server_url);
      if (metadata) {
        env.fhir.metadata = metadata
        return true
      }
    } catch (err) {
      return false;
    }
  }
}
