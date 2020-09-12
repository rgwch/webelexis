import { ObjectManager } from './object-manager';
import Delta from 'quill-delta'

import { IElexisType, UUID } from './elexistype';
export interface IStickyNote extends IElexisType{
  patientid: UUID
  delta: Delta   
}

export class StickynoteManager extends ObjectManager{

  constructor(){
    super('stickynotes')
  }
}
