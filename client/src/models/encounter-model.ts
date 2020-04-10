import { ObjectManager } from './object-manager';
import { ICase } from './case-manager';
import { IPatient } from './patient-model';
import { IElexisType, ELEXISDATE, UUID } from './elexistype';

export interface IEncounter extends IElexisType{
  datum: ELEXISDATE
  zeit: string
  mandantid: UUID
  fallid: UUID
  rechnungsid?: UUID
  leistungen?: string
  eintrag: {
    remark: string
    html?: string
    timestamp: string
  }
  _Patient?: IPatient
  _Fall?: ICase
}

export class EncounterManager extends ObjectManager{

  constructor(){
    super('konsultation')
  }
}
