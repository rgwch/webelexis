import { autoinject } from 'aurelia-framework';
import { IKontakt, KontaktManager } from './kontakt-model';
import { ObjectManager } from './object-manager';
import { UUID, IElexisType, ELEXISDATE, ELEXISDATETIME } from './elexistype';


export interface IEvent extends IElexisType{
  patid: UUID
  bereich: string
  tag: ELEXISDATE
  beginn: string
  dauer: string
  grund: string
  termintyp: string
  terminstatus: string
  erstelltvon: UUID
  angelegt: ELEXISDATETIME
  lastedit: ELEXISDATETIME
  casetype: string
  insurancetype: string
  treatmentreason: string
  kontakt?: IKontakt
}

@autoinject
export class EventManager extends ObjectManager{
  constructor(private km:KontaktManager){
    super('termin')
  }

  getLabel(ev:IEvent){
    if(ev.kontakt){
      return this.km.getLabel(ev.kontakt)
    }
    if(ev.patid){
      return ev.patid
    }else{
      return "Reserviert"
    }
  }
}
