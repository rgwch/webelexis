import { autoinject, LogManager } from 'aurelia-framework';
import { StickerManager } from '../models/sticker-manager';
import { PatientManager } from '../models/patient-manager';
import { IKontakt } from '../models/kontakt-manager';
import { bindable } from 'aurelia-framework';
import { ISticker } from 'models/sticker-manager';

const log = LogManager.getLogger('Stickers')

@autoinject
export class Stickers {
  @bindable kontakt: IKontakt
  stickers: Array<ISticker>

  constructor(private pam: PatientManager, private stm: StickerManager) { }

  attached() {
    return this.stm.loadStickers().then(st => {
      log.info('"Stickers loaded')
    })
  }

  async kontaktChanged(newp: IKontakt, oldp: IKontakt) {
    this.stickers = []
    if (!newp.stickers) {
      newp.stickers = await this.stm.loadFor(newp.id)
    }
    if (newp.stickers) {
      newp.stickers.forEach(async stic => {
        this.stickers.push(await this.stm.getSticker(stic))
      });
    }
  }
  getCss(sticker) {
    return `color:#${sticker.foreground};background-color:
    #${sticker.background}`
  }
}
