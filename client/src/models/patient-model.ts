import { ObjectManager } from './../../../old_client/src/models/object-manager';
import { IKontakt, KontaktManager } from './kontakt-model';
import {ISticker} from './sticker-manager'

export interface IPatient extends IKontakt{
}

export class PatientManager extends ObjectManager{
    constructor(){
      super('patient')
    }

}
