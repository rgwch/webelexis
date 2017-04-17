/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {HttpWrapper} from "./http-wrapper";

export class LocalHttpWrapper extends HttpWrapper {

  private runMode="debug"

  formatUrl(url: string) {

    if (this.runMode == "debug") {

      if (url === 'dologin' || url === "configuration" || url.startsWith("auth")) {
        return `http://localhost:2017/${url}`
      } else {
        return `http://localhost:2017/fhir/${url}`
      }
    } else {
      if (url === 'dologin' || url === "configuration" || url.startsWith("auth")) {
        return "/" + url
      } else {
        return "/fhir/" + url
      }
    }
  }
}
