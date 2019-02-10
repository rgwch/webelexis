/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, computedFrom } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";
import { FlexformConfig, FlexFormValueConverter } from "../components/flexform";
import { Patient } from "../models/patient";
import { StickerManager } from "../models/stickers.model";
import { DataService, DataSource } from "../services/datasource";

/**
 * Display and modify data/details for the currently selected patient
 */
@autoinject
@connectTo(store => store.state.pipe( pluck("patient") as any))
export class PatientBasedata {
  public state;
  private def: FlexformConfig;
  private patientService: DataService;

  constructor(
    private i18: I18N,
    private ds: DataSource,
    private sm: StickerManager
  ) {
    this.def = Patient.getDefinition();
    this.patientService = ds.getService("patient");
    this.patientService.on("updated", obj => {
      this.state = obj;
    });
  }

  protected stickerName(sticker) {
    return this.sm.getSticker(sticker).name;
  }

  protected imageData(sticker) {
    return this.sm.getImage(sticker);
  }
}
