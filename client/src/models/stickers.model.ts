import { StickerType } from './stickers.model';
import { DataSource, DataService } from './../services/datasource';
import { ElexisType } from './elexistype';
import { autoinject } from 'aurelia-framework';

export interface StickerType extends ElexisType{
  Name:string
  importance:string
  imagedata:Int8Array
  foreground:string
  background:string
}


@autoinject
export class StickerManager{
  private stickerService:DataService
  private allStickers

  constructor(private ds:DataSource){
    this.stickerService=ds.getService('stickers')
  }

  async loadStickers(){
    this.stickerService.find().then(stickers=>{
      for(const sticker of stickers){
        this.allStickers[sticker.name]=sticker
      }
    })
  }
}
