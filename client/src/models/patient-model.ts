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
    constructor(private km:KontaktManager){
      super('patient')
    }

    getLabel(pat: IPatient){
      const lbl=this.km.getLabel(pat)+" ("+this.getAge(pat)+") "
      return lbl+" ["+pat.patientnr+"]"
    }

    getAge(pat: IPatient){
      const now=moment()
      const bd=moment(pat.geburtsdatum,"YYYYMMDD")
      const age=now.diff(bd,'years')
      if(age<2){
        const mo=now.diff(bd,'months')
        return age+" "+mo+"/12"
      }else{
        return age
      }
    }
}
