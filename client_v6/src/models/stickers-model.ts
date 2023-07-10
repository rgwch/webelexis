/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType } from "./elexistype"
import { getService } from "../services/io"
import { ObjectManager } from "./object-manager"

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


export class StickerManager extends ObjectManager {
  private allStickers = new Map<string, StickerType>();

  constructor() {
    super("stickers")
  }

  public async getSticker(name: string): Promise<StickerType> {
    let sticker = this.allStickers.get(name)
    if (!sticker) {
      const stickers = await super.find({ query: { name } })
      if (stickers.data && stickers.data.length) {
        sticker = stickers.data[0]
        this.allStickers.set(name, sticker)
      }
    }
    return sticker
  }

  /**
   * retrieve the image data fr a sticker
   * @param stickername 
   * @returns undefined ig the sticker doesn't exist or has no image attached
   */
  public async getImage(stickername: string) {
    const st = await this.getSticker(stickername)
    return st?.imagedata
  }

  /** 
   * retrieve the most important sticker from an array (i.e. that with the highest priority) 
   * @returns the most important sticker or undefined, if stickerNames was empty or undefined
   * */
  public async getFirstSticker(stickerNames: string[]): Promise<StickerType> {
    if (stickerNames && stickerNames.length > 0) {
      let ret = await this.getSticker(stickerNames[0])
      if (ret) {
        for (const st of stickerNames) {
          const cand = await this.getSticker(st)
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

