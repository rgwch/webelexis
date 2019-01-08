/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";
import { BriefType } from "models/briefe-model";
import { DataService, DataSource, IQueryResult } from "services/datasource";

@autoinject
export class ShowTemplates {
  protected templates: BriefType[];
  protected selected: BriefType;
  private briefeService: DataService;

  constructor(private dc: DialogController, ds: DataSource) {
    this.briefeService = ds.getService("briefe");
  }

  public attached() {
    this.briefeService
      .find({ query: { typ: "Vorlagen", Betreff: { $like: "%_webelexis" } } })
      .then((result: IQueryResult) => {
        this.templates = result.data;
      });
  }
  protected select(item: BriefType) {
    this.selected = item;
  }
}
