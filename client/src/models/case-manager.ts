import { ObjectManager } from './object-manager';
import { IElexisType } from './elexistype';

export interface ICase extends IElexisType{
  grund: string
}

export class CaseManager extends ObjectManager{

  constructor(){
    super('fall')
  }
}
