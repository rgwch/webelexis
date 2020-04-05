/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";

/**
 * Modal Dialog to enter a Server Address
 */
@autoinject
export class SelectServer {
  private url: string;

  constructor(protected controller: DialogController) {}

  public activate(params) {
    this.url = params.url;
  }
}
