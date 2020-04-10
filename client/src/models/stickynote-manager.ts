import { ObjectManager } from './object-manager';

import { IElexisType, UUID } from './elexistype';
export interface IStickyNote extends IElexisType{
  patientid: UUID
  contents: string
}

export class StickynoteManager extends ObjectManager{

  constructor(){
    super('stickynotes')
  }
}
