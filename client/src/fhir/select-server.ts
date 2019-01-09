/************************************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2018-2019 by G. Weirich
 *
 * Webelexis is licensed under the terms of the included
 * LICENSE file.
 *************************************************************/

import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";

@autoinject
export class SelectServer {
  private url: string;

  constructor(private controller: DialogController) {}

  public activate(params) {
    this.url = params.url;
  }
}
