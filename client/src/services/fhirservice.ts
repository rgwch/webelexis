/************************************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2018 by G. Weirich
 *
 * Webelexis is licensed under the terms of the included
 * LICENSE file.
 *************************************************************/
import { autoinject, noView } from "aurelia-framework";
import env from "environment"
import "fhirclient";
import { ElexisType } from "models/elexistype";
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

  /**
   * retrieve server metadata (https://www.hl7.org/fhir/http.html#capabilities)
   * @param server_uri
   */
  public metadata(serverUri): Promise<any> {
    console.log("metadata for " + serverUri);
    return fetch(serverUri + "/metadata?_format=application/fhir+json")
      .then(response => {
        return response;
      })
      .then(resp => {
        return resp.json();
      });
  }

  /**
   * Initialize a Smart-On-FHIR session. The oauth2-Framework will redirect to the client_redirect address
   * after successful authentication and authorization.
   * @param server_uri
   */
  public init(serverUri: string) {
    FHIR.oauth2.authorize({
      client: {
        client_id: env.fhir.client_id,
        redirectUri: this.getBaseURL() + env.fhir.client_redirect,
        scope: "fhir"
      },
      server: serverUri
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

  /**
   * search the FHIR server for a given datatype and convert the result to an
   * array of FHIRobjects
   *
   * @param factory the factory for the queried FHIRobject subtype (see src/models/*)
   * @param query a query (form depends of the queried type, see FHIR documentation)
   */
  public async filter(
    query
  ): Promise<IBundleResult> {
    if (this.smart == null) {
      const sm = await this.getSmartclient();
    }
    return this.smart.api
      .search({ type: "Patient", query })
      .then(results => {
        return results
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
