/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, LogManager } from "aurelia-framework";
import env from "environment"
import "fhirclient";
import { ElexisType } from "models/elexistype";
const log = LogManager.getLogger("Fhir-Service")
declare const FHIR;

export interface IBundleResult {
  status: "ok" | "error";
  message?: string;
  values?: ElexisType[];
  count: number;
  links?: any[];
}
/**
 * This class handles all interactions with the Smart-On-Fhir library and the FHIR server.
 */
@autoinject
export class FhirService {
  private smart = null;
  private client = {
    client_id: env.fhir.client_id,
    redirect_uri: this.getBaseURL() + env.fhir.client_redirect,
    scope: "fhir"
  }

  /**
   * retrieve server metadata (https://www.hl7.org/fhir/http.html#capabilities)
   * @param server_uri
   */
  public metadata(serverUri): Promise<any> {
    log.info("metadata for " + serverUri);
    return fetch(serverUri + "/metadata?_format=application/fhir+json")
      .then(response => {
        return response;
      })
      .then(resp => {
        return resp.json();
      }).catch(err => {

        alert("could not retrieve metadata")
        // alert("FHIR data: "+JSON.stringify(env.fhir))

      })
  }

  /**
   * Initialize a Smart-On-FHIR session. The oauth2-Framework will redirect to the client_redirect address
   * after successful authentication and authorization. By default, it's redirected to /#/auth which leads
   * to the component ./fhir_ready.
   * @param server_uri
   */
  public init(serverurl) {
    // alert("FHIR data: "+JSON.stringify(env.fhir))
    FHIR.oauth2.authorize({
      client: this.client,
      server: serverurl
    });
  }

  /**
   * Fetch the SmartClient. This will only work after successful autentication and authorization,
   * e.g. by a previous call to init() (see above)
   */
  public getSmartclient(): Promise<any> {
    return new Promise((resolve, reject) => {
      FHIR.oauth2.ready(
        smart => {
          this.smart = smart;
          resolve(smart);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  private getBaseURL() {
    let ret = window.location.href;
    const pos = ret.search(window.location.hash);
    if (pos > -1) {
      ret = ret.substring(0, pos);
    }
    return ret;
  }
}
