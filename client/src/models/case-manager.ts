import { ObjectManager } from './../../../old_client/src/models/object-manager';
import { IElexisType } from './elexistype';

export interface ICase extends IElexisType{

}

export class CaseManager extends ObjectManager{

  constructor(){
    super('fall')
  }
}
