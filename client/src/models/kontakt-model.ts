import { autoinject } from 'aurelia-framework';
import { DateTime } from '../services/datetime';
import { ObjectManager } from './object-manager';
import { IElexisType, UUID } from './elexistype'

export interface IKontakt extends IElexisType{
  bezeichnung1: string;
  bezeichnung2?: string;
  bezeichnung3?: string;
  geburtsdatum?: string;
  istperson?: string;
  istanwender?: string;
  istmandant?: string;
  istorganisation?: string;
  geschlecht?: "m" | "f" | "w" | "?";
  strasse?: string;
  plz?: string;
  ort?: string;
  telefon1?: string;
  telefon2?: string;
  titel?: string
  titelsuffix?: string
  natelnr?: string;
  email?: string;
  bemerkung?: string;
  extjson?: any
}

@autoinject
export class KontaktManager extends ObjectManager{
  constructor(private dt:DateTime){
    super('kontakt')
  }

  getLabel(k:IKontakt){
    return k.bezeichnung1+" "+k.bezeichnung2+", "+this.dt.ElexisDateToLocalDate(k.geburtsdatum)
  }

  getGeburtsdatum(k: IKontakt){
    return this.dt.ElexisDateToLocalDate(k.geburtsdatum)
  }
}
