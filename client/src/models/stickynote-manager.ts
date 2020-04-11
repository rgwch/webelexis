import { ObjectManager } from './object-manager';

import { IElexisType, UUID } from './elexistype';
export interface IStickyNote extends IElexisType{
  patientid: UUID
  contents: string // compressed contents
  text: string  // uncompressed
  html: string   //html
}

export class StickynoteManager extends ObjectManager{

  constructor(){
    super('stickynotes')
  }
}
