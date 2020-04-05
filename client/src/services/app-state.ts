import { autoinject } from 'aurelia-framework';
import { IUser } from '../models/user-model';

@autoinject
export class AppState{

  public loggedInUser:IUser
}
