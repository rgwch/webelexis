import { ObjectManager } from './object-manager';
import { IKontakt } from './kontakt-manager';
import { UUID, IElexisType } from './elexistype';


export interface IUser extends IKontakt {
  _Kontakt?: IKontakt,
  _Mandator?: IKontakt,
  _Mandators?: string,
  is_active?: string,
  is_administrator?: string,
  extjson?: any,
  allow_external?: string,
  roles: string[]
}

export class UserManager extends ObjectManager {
  public getActiveMandatorFor(user: IUser) {
    return user
  }
}
