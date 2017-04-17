/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {HttpWrapper} from "./http-wrapper";

export class LocalHttpWrapper extends HttpWrapper {

  private runMode="release"

  formatUrl(url: string) {

    if (this.runMode == "debug") {

      if (url === 'dologin' || url === "configuration") {
        return `http://localhost:3000/${url}`
      } else {
        return `http://localhost:3000/fhir/${url}`
      }
    } else {
      if (url === 'dologin' || url === "configuration") {
        return "/" + url
      } else {
        return "/fhir/" + url
      }
    }
  }
}
