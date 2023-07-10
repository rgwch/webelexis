/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType } from "./elexistype"
import { getService } from "../services/io"

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


export class StickerManager {
  private stickerService
  private allStickers = {}
  public stickers_loaded = false;
  private static theInstance: StickerManager

  public static getInstance(): StickerManager {
    if (!StickerManager.theInstance) {
      StickerManager.theInstance = new StickerManager()
    }
    return StickerManager.theInstance
  }

  private constructor() {
    this.stickerService = getService("stickers")
    this.loadStickers().then(() => {
      this.stickers_loaded = true
    })
  }

  public loadStickers(): Promise<any> {
    return this.stickerService.find().then(stickers => {
      for (const sticker of stickers.data) {
        this.allStickers[sticker.name] = sticker
      }
      return this.allStickers
    })
  }

  public getSticker(name: string): StickerType {
    return this.allStickers[name]
  }

  public getImage(stickername: string) {
    const st = this.getSticker(stickername)
    return st ? st.imagedata : undefined
  }

  public getFirstSticker(stickerNames: string[]): StickerType {
    if (stickerNames && stickerNames.length > 0) {
      let ret = this.getSticker(stickerNames[0])
      if (ret) {
        for (const st of stickerNames) {
          const cand = this.getSticker(st)
          if (parseInt(cand.importance, 10) > parseInt(ret.importance, 10)) {
            ret = cand
          }
        }
        return ret
      }
    }
    return undefined
  }
}

