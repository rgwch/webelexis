import { I18N } from 'aurelia-i18n';
import { ObjectManager } from './object-manager';
import { IKontakt, KontaktManager } from './kontakt-model';
import {ISticker} from './sticker-manager'
import {autoinject} from 'aurelia-framework'
import * as moment from 'moment'

export interface IPatient extends IKontakt{
  patientnr: string
}

@autoinject
export class PatientManager extends ObjectManager{
    constructor(private km:KontaktManager, private i18:I18N){
      super('patient')
    }

    getLabel(pat: IPatient){
      const lbl=this.km.getLabel(pat)+" ("+this.getAge(pat)+") "
      return lbl+" ["+pat.patientnr+"]"
    }

    getAge(pat: IPatient){
      const now=moment()
      const bd=moment(pat.geburtsdatum,this.i18.tr("adapters.database_format_date"))
      const age=now.diff(bd,'years')
      if(age<2){
        const mo=now.diff(bd,'months')
        return age+" "+mo+"/12"
      }else{
        return age
      }
    }
}
