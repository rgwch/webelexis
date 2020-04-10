import { autoinject } from 'aurelia-framework';
import { StickerManager } from '../models/sticker-manager';
import { PatientManager } from '../models/patient-model';
import { IKontakt } from './../models/kontakt-model';
import { bindable } from 'aurelia-framework';
import { ISticker } from 'models/sticker-manager';

@autoinject
export class Stickers{
  @bindable kontakt:IKontakt
  stickers: Array<ISticker>

  constructor(private pam:PatientManager, private stm:StickerManager){}

  async kontaktChanged(newp:IKontakt,oldp:IKontakt){
    this.stickers=[]
    if(!newp.stickers){
      newp.stickers=await this.stm.loadFor(newp.id)
    }
    if(newp.stickers){
      newp.stickers.forEach(stic => {
        this.stickers.push(this.stm.getSticker(stic))
      });
    }
  }
  getCss(sticker){
    return `color:#${sticker.foreground};background-color:
    #${sticker.background}`
  }
}
