/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import {connectTo} from 'aurelia-store'
import { autoinject, computedFrom } from 'aurelia-framework'
import { pluck } from 'rxjs/operators'
import {FlexformConfig, FlexFormValueConverter} from '../flexform'
import { I18N } from 'aurelia-i18n';
import {Patient} from '../../models/patient'
import { DataSource, DataService } from '../../services/datasource';
import { StickerManager } from '../../models/stickers.model';

/**
 * Display and modify data/details for the currently selected patient
 */
@autoinject
@connectTo(store=>store.state.pipe(<any>pluck("patient")))
export class PatientBasedata {
  state
  def:FlexformConfig
  patientService:DataService

  constructor(private i18:I18N, private ds:DataSource, private sm:StickerManager){
    this.def=Patient.getDefinition();
    this.patientService=ds.getService('patient')
    this.patientService.on('updated',(obj)=>{
      this.state=obj
    })
  }

  stickerName(sticker){
    return this.sm.getSticker(sticker).Name
  }

  imageData(sticker){
    return this.sm.getImage(sticker)
  }

}
