/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {HttpWrapper} from "./http-wrapper";
import {Config} from "../config";
import {Container} from "aurelia-framework";

export class LocalHttpWrapper extends HttpWrapper {

  cfg = Container.instance.get(Config)

  formatUrl(url: string) {
    if (this.cfg.runMode == "debug") {

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
