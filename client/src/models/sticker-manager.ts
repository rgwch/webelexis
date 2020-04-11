import { AppState } from './../services/app-state';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { ObjectManager } from './object-manager';
import { IElexisType } from "./elexistype"
import { autoinject } from "aurelia-framework"

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
export class StickerManager extends ObjectManager{
  private allStickers = {}

  constructor(private appState:AppState) {
    super('stickers')
    this.appState.subscribe( async newUser => {
      await this.loadStickers()
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

  public async loadFor(id:string){
    const result= (await super.find({"forPatient": id})) as any
    return result.map(x=>x.name)
  }

  public getSticker(name: string): ISticker {
    return this.allStickers[name]
  }

  public getImage(stickername: string) {
    const st = this.getSticker(stickername)
    return st ? st.imagedata : undefined
  }

  public getFirstSticker(stickerNames: string[]): ISticker {
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
