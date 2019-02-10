/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { StickerType } from './stickers.model';
import { DataSource, DataService } from './../services/datasource';
import { ElexisType } from './elexistype';
import { autoinject } from 'aurelia-framework';

/**
 * The Elexis 'Sticker' or 'Etikette' is some sort of badge or label for an object.
 */
export interface StickerType extends ElexisType {
  name: string
  importance: string
  imagedata: Int8Array
  foreground: string
  background: string
}


@autoinject
export class StickerManager {
  private stickerService: DataService
  private allStickers = {}

  constructor(private ds: DataSource) {
    this.stickerService = ds.getService('stickers')
  }

  loadStickers(): Promise<any> {
    return this.stickerService.find().then(stickers => {
      for (const sticker of stickers.data) {
        this.allStickers[sticker.Name] = sticker
      }
      return this.allStickers
    })
  }

  getSticker(name: string): StickerType {
    return this.allStickers[name]
  }

  getImage(stickername: string) {
    const st = this.getSticker(stickername)
    return st ? st.imagedata : undefined
  }

  getFirstSticker(stickerNames: Array<string>): StickerType {
    if (stickerNames && stickerNames.length > 0) {
      let ret = this.getSticker(stickerNames[0])
      if (ret) {
        for (const st of stickerNames) {
          const cand = this.getSticker(st)
          if (parseInt(cand.importance) > parseInt(ret.importance)) {
            ret = cand
          }
        }
        return ret;
      }
    }
    return undefined
  }
}
