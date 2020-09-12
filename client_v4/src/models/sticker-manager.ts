/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { ObjectManager } from './object-manager';
import { IElexisType } from "./elexistype"
import { autoinject } from "aurelia-framework"
import { AppState } from '../services/app-state';

/**
 * The Elexis 'Sticker' or 'Etikette' is some sort of badge or label for an object.
 */
export interface ISticker extends IElexisType {
  name: string
  importance: string
  imagedata: Int8Array
  foreground: string
  background: string
}

@autoinject
export class StickerManager extends ObjectManager {
  private allStickers = {}
  private bLoaded: boolean = false;

  constructor(private appState: AppState) {
    super('stickers')
    this.appState.subscribe(async newUser => {
      await this.ensureLoaded()
    })
  }

  public loadStickers(): Promise<any> {
    return this.find().then(stickers => {
      for (const sticker of stickers.data) {
        this.allStickers[sticker.name] = sticker
      }
      return this.allStickers
    })
  }

  public async ensureLoaded() {
    if (!this.bLoaded) {
      await this.loadStickers()
    }
  }

  /**
   * Fetch all Stickernames for a gibven Patient
   * @param id ID of the patient
   */
  public async loadFor(id: string): Promise<Array<string>> {
    await this.ensureLoaded()
    const result = (await super.find({ "forPatient": id })) as any
    return result.map(x => x.name)
  }

  public async getSticker(name: string): Promise<ISticker> {
    await this.ensureLoaded()
    return this.allStickers[name]
  }

  public async getImageData(stickername: string): Promise<Int8Array> {
    const st = await this.getSticker(stickername)
    return st ? st.imagedata : undefined
  }

  public async getImageHtml(stickername: string): Promise<string> {
    const imgdata = await this.getImageData(stickername)
    if (imgdata) {
      const imgtag = `<img src="data:image/png;base64,${imgdata}" 
      alt="${name}" style="height:1em;width:1em;padding-left:2px;"
     data-toggle="tooltip" title="${name}">`;
      return imgtag
    }
    return undefined
  }

  public async getFirstSticker(stickerNames: string[]): Promise<ISticker> {
    await this.ensureLoaded()
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
