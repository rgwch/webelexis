import { ObjectManager } from './object-manager';
import { ELEXISDATE } from './elexistype';
import { UUID } from 'models/elexistype';
import { IElexisType } from './elexistype';

export interface ICertificate extends IElexisType{
  patientid: UUID
  fallid: UUID
  prozent: string
  datumvon: ELEXISDATE
  datumbis: ELEXISDATE
  grund: string 
  aufzusatz?: string 
  briefid?: UUID
  datumauz: ELEXISDATE
}

export class CertificateManager extends ObjectManager{
  constructor(){
    super('auf')
  }
}
